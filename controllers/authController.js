import { body, validationResult, matchedData } from 'express-validator';

const authController = {};

authController.getLogIn = (req, res) => {
  return res.render('login');
};
authController.postLogIn = (req, res) => {};

authController.getSignUp = (req, res) => {
  return res.render('signup');
};
authController.postSignUp = (req, res) => {};

authController.logOut = (req, res) => {};

export default authController;
