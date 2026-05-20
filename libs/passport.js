import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
