/* eslint-disable camelcase */
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require('sequelize');
const User = require('../models/userModel');
const Profile = require('../models/userProfileModel');
const sendActivationLinkEmail = require('../helpers/sendActivationEmail');
const sendResetLinkEmail = require('../helpers/sendResetPasswordEmail');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');

const getLogin = (req, res) => {
   res.render('userPages/login', {isUser: true});
};

const postLogin = (req, res, next) => {
   // // Retrieve the saved URL from the session and redirect the user back
   // const returnTo = req.session.returnTo;
   // delete req.session.returnTo;

   passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true,
   })(req, res, next);
};

const getRegister = async (req, res) => {
   const userRoles = await fetchUserRoles();
   res.render('userPages/register', {userRoles, selectedRoleName: null});
};

const postRegister = async (req, res, next) => {
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const userRoles = await fetchUserRoles();

   try {
      const {name, email, password, password2, role_id} = req.body;
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('userPages/register', {
            errors,
            name,
            email,
            password,
            password2,
            selectedRoleName: role_id,
            userRoles,
         });
      }
      const user = await User.findOne({where: {email}});
      console.log('user =>', user);
      if (user) {
         // User Exists, return back to form
         errors.push({msg: 'Email is already registered'});
         return res.render('userPages/register', {
            errors,
            name,
            email,
            password,
            password2,
            userRoles,
            selectedRoleName: role_id,
         });
      }
      // validations passed, create user and send activation email
      const newUser = new User({name, email, password, role_id, ip_addr});
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);
      // set password to hashed password and the activation_key
      newUser.password = hash;
      const savedUser = await newUser.save();
      sendActivationLinkEmail(req, res, next, savedUser.email);
      req.flash('success_msg', 'Please check your email and activate the account.');
      return res.redirect('/users/login');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}; // end of postRegisterController

const getForgotPassword = async (req, res, next) => {
   try {
      const {token} = req.params;
      const user = await User.findOne({where: {reset_key: token}});
      if (!user) {
         req.flash('error_msg', 'Invalid token.');
         return res.redirect('/users/sendResetLink');
      }
      return res.render('userPages/forgotPassword');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}; // end forgotPassword function

const postForgotPassword = async (req, res, next) => {
   try {
      const {token} = req.params;
      // process further, token issued by us...
      const {password} = req.body;
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('userPages/forgotPassword', {errors});
      }
      const decoded = await jwt.verify(token, process.env.JWT_RESET_KEY);
      const user = await User.findOne({
         where: {id: decoded.id, email: decoded.email, reset_key: token},
      });
      if (!user) {
         req.flash('error_msg', 'Invalid User or expired link.');
         return res.redirect('/users/sendResetLink');
      }
      // User found with id, email and token
      user.reset_key = ''; // so that same link cannot be used twice...
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
      await user.save(); // update user as active and no activation_key
      req.flash('success_msg', `Password for <i>${decoded.email}</i> has been updated, you can login now.`);
      return res.redirect('/users/login');
   } catch (error) {
      // handle jwt errors
      if (error.name === 'TokenExpiredError') {
         req.flash('error_msg', 'Link is expired, please regenerate');
         return res.redirect('/users/sendResetLink');
      }
      if (error.name === 'JsonWebTokenError') {
         req.flash('error_msg', 'Link is invalid, please regenerate');
         return res.redirect('/users/sendResetLink');
      }
      logger.error(error);
      return next(error);
   }
}; // end of postForgotPassword function

const getResetLink = (req, res) => res.render('userPages/resetPassword'); // end of getResetLink function

const postResetLink = async (req, res, next) => {
   try {
      const {email} = req.body;
      const user = await User.findOne({where: {email}});
      if (!user) {
         req.flash('error_msg', `<i>${email}</i> is not registered. Please try again or register first.`);
         return res.redirect('/users/sendResetLink');
      }
      // User found with email send activation link email
      sendResetLinkEmail(req, res, next, user.email);
      req.flash(
         'success_msg',
         `An email with link to reset password is sent on <i>${user.email}</i>. Please reset your password.`
      );
      return res.redirect('/users/login');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}; // end of postResetLink function

const getActivationLink = (req, res) => res.render('userPages/resendActivation'); // end of getActivationLink function

const postActivationLink = async (req, res, next) => {
   try {
      const {email} = req.body;
      const user = await User.findOne({where: {email}});
      if (!user) {
         req.flash('error_msg', `<i>${email}</i> is not registered. Please try again or register first.`);
         return res.redirect('/users/sendActivationLink');
      }
      // User found with email send activation link email
      sendActivationLinkEmail(req, res, next, user.email);
      req.flash(
         'success_msg',
         `An email with activation link is send on <i>${user.email}</i>. Please activate your account.`
      );
      return res.redirect('/users/login');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}; // end of postActivationLink function

const getActivateLinkHandler = async (req, res, next) => {
   try {
      const {token} = req.params;
      // check if token is expired

      const decoded = await jwt.verify(token, process.env.JWT_ACTIVE_KEY);
      const user = await User.findOne({
         where: {
            id: decoded.id,
            email: decoded.email,
            activation_key: token,
         },
      });
      if (!user) {
         req.flash('error_msg', 'Invalid user or link');
         return res.redirect('/users/sendActivationLink');
      }
      // User found with id, email and token
      user.activation_key = ''; // so that same link cannot be used twice...
      user.active = true;
      await user.save(); // update user as active and no activation_key
      req.flash('success_msg', `${decoded.email} has been activated, you can login now.`);
      return res.redirect('/users/login');
   } catch (error) {
      // handle jwt errors
      if (error.name === 'TokenExpiredError') {
         req.flash('error_msg', 'Link is expired, please regenerate');
         return res.redirect('/users/sendActivationLink');
      }
      if (error.name === 'JsonWebTokenError') {
         req.flash('error_msg', 'Link is invalid, please regenerate');
         return res.redirect('/users/sendActivationLink');
      }
      logger.error(error);
      return next(error);
   }
}; // end of getActivationLinkHandler function

const getProfile = async (req, res, next) => {
   // if profile is already there in db, fetch it and pass on to fill the form...
   try {
      const userProfile = await Profile.findOne({
         where: {user_id: req.user.id},
      });
      // console.log(userProfile, req.user.id);
      const {address, city, state, pincode, phone} = userProfile || {}; // blank if userProfile is not found in db.
      return res.render('userPages/userProfile', {
         address,
         city,
         state,
         pincode,
         phone,
      });
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}; // end of getProfile function

const postProfile = async (req, res, next) => {
   try {
      const {address, city, state, pincode, phone} = req.body;
      const userProfile = await Profile.findOne({
         where: {user_id: req.user.id},
      });
      if (userProfile) {
         // profile already in DB, update it
         await userProfile.update({
            address,
            city,
            state,
            pincode,
            phone,
         });
      } else {
         // profile is not found, create new and save
         const newProfile = new Profile({
            user_id: req.user.id,
            address,
            city,
            state,
            pincode,
            phone,
         });
         await newProfile.save();
      }
      req.flash('success_msg', 'Profile saved successfully.');
      return res.redirect('/users/profile');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
}; // end of postProfile function

const getLogout = async (req, res, next) => {
   req.logout((err) => {
      if (err) return next(err);
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
      return req.session.destroy();
   });
}; // end of getLogout function

async function fetchUserRoles() {
   try {
      const rows = await db.query('SELECT * FROM user_roles;', {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch user_roles from database", error);
      }
      return null;
   }
}

module.exports = {
   getLogin,
   postLogin,
   getRegister,
   postRegister,
   getForgotPassword,
   postForgotPassword,
   getResetLink,
   postResetLink,
   getActivationLink,
   postActivationLink,
   getActivateLinkHandler,
   getProfile,
   postProfile,
   getLogout,
};
