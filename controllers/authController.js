import { body, validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcryptjs';
import { prisma } from '../libs/prisma.js';
import passport from '../libs/passport.js';

const authController = {};

const signUpValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ max: 100 })
    .withMessage('Username must be 100 characters or less.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an upper case.')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lower case.')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number.')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain a special character.'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }
    return value === req.body.password;
  }),
];

const logInValidation = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

authController.getSignUp = (req, res) => {
  return res.render('signup');
};
authController.postSignUp = [
  signUpValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        if (error.path) {
          fieldErrors[error.path] = error.msg;
        }
      });
      console.log(req.body);
      return res.render('signup', {
        fieldErrors,
        formData: req.body,
      });
    }

    try {
      const { username, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          folders: {
            create: {
              name: 'Home',
              isRoot: true,
            },
          },
        },
      });

      console.log(user);

      return req.login(user, (error) => {
        if (error) return next(error);
        res.redirect('/');
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.render('signup', {
          fieldErrors: {
            username: 'Username already exists.',
          },
          formData: req.body,
        });
      }

      return next(error);
    }
  },
];

authController.getLogIn = (req, res) => {
  return res.render('login');
};
authController.postLogIn = [
  logInValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        if (error.path) {
          fieldErrors[error.path] = error.msg;
        }
      });

      return res.render('login', {
        fieldErrors,
        formData: req.body,
      });
    }

    passport.authenticate('local', (error, user, info) => {
      if (error) return next(error);

      if (!user) {
        return res.render('login', {
          loginError: true,
          formData: req.body,
        });
      }

      req.login(user, (error) => {
        if (error) {
          return next(error);
        }
        res.redirect('/');
      });
    })(req, res, next);
  },
];

authController.getLogOut = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
  });
  return res.redirect('/');
};

export default authController;
