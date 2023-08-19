const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const User = require('../models/userModel');
const logger = require('./winston');
const host = require('../config/host-config');

async function sendResetPasswordLink(req, res, next, email) {
   try {
      const user = await User.findOne({where: {email}});
      if (!user) {
         // User Exists, return back to form
         let errors;
         errors.push({
            msg: 'Unable to send reset password link email, User does not exist.',
         });
         return res.render('userPages/register', {errors});
      }
      // User found, Generate a token, send email and update token in user record...
      const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_RESET_KEY, {expiresIn: '2h'});
      const emailOptions = {
         to: user.email,
         cc: '',
         subject: 'Snehaanchal User - Reset your password',
         text: `<h2>Use the link below to reset your password.</h2><br><a style="background-color: #66a3ff; color: white; padding: 1em 4em;text-decoration:none; border-radius: 10px" href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/users/forgotPassword/${token}"> Click here to reset password.</a>.<br><br>The link is valid only for 2 hours.<br>The link will work only once.<br><br><strong>Snehaanchal Team</strong>`,
      };
      sendEmails(emailOptions);
      user.reset_key = token;
      await user.save();
      logger.info(`Password Reset Email sent to:' ${user.email}`);
      return null;
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}

module.exports = sendResetPasswordLink;
