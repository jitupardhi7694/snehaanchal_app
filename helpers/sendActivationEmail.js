const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const User = require('../models/userModel');
const host = require('../config/host-config');
const logger = require('./winston');

async function sendActivationLink(req, res, next, email) {
   try {
      const user = await User.findOne({where: {email}});
      if (!user) {
         // User Exists, return back to form
         let errors;
         errors.push({
            msg: 'Unable to send activation email, User does not exist.',
         });
         return res.render('userPages/register', {errors});
      }
      // Generate a token, send email and update token in user record...
      const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_ACTIVE_KEY, {expiresIn: '2h'});
      const emailOptions = {
         to: user.email,
         cc: '',
         bcc: '',
         subject: 'Snehaanchal User Registered - Please Activate your account',
         text: `<h2>You are now registered with Snehaanchal.</h2><br>Please activate your account.<br><br><a style="background: rgb(246, 165, 236); color: black; padding: 1em 4em;text-decoration:none; border-radius: 10px" href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/users/activate/${token}"> Activate by clicking here.</a>.<br><br>The link is valid only for 2 hours.<br>This link can be used only once.<br><br><strong>Snehaanchal Team</strong>`,
      };
      sendEmails(emailOptions);
      user.activation_key = token;
      const savedUser = await user.save();
      return logger.info(`Activation Email sent to: ${savedUser.email}`);
   } catch (error) {
      logger.error(error);
      // eslint-disable-next-line no-undef
      return next(error);
   }
}

module.exports = sendActivationLink;
