const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const logger = require('./winston');

// Load User Model
const User = require('../models/userModel');

module.exports = (passport) => {
   try {
      passport.use(
         new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
            // Match user
            const user = await User.findOne({where: {email}});
            if (!user) {
               const msg =
                  'This email is not registered.<br>Please <a href="/users/register" class="alert-link">register</a> before trying to login.';
               return done(null, false, {message: msg});
            }
            if (user.active !== true) {
               return done(null, false, {
                  message:
                     '<strong>Email not activated</strong>.\n Please activate using the link sent to your email. To resend activation link, click <a href="/users/sendActivationLink" class="alert-link">here</a>',
               });
            }
            // email is there, match password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
               return done(null, user, {message: 'Logging Im'});
            }
            return done(null, false, {
               message: 'Username/Password incorrect',
            });
         })
      );
   } catch (err) {
      logger.error(err);
   }

   passport.serializeUser((user, done) => done(null, user.id));

   passport.deserializeUser(async (id, done) => {
      const user = await User.findByPk(id);
      if (!user) logger.info('User not found during deserializeUser');
      return done(null, user);
   });
};
