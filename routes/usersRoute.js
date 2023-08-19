const express = require('express');

const router = express.Router();
const {
   userValidationRules,
   changePasswordRules,
   profileValidationRules,
   validate,
} = require('../helpers/validators/userValidator');
const {ensureAuthenticated, ensureNotAuthenticated} = require('../helpers/auth-helper');
const userController = require('../controllers/userController');
const rateLimiter = require('../helpers/rate-limiter');

// limit access to routes in this filename
router.use(rateLimiter);

// Login Page
router.get(['/login', '/'], ensureNotAuthenticated, (req, res, next) => {
   // Save the calling URL in the session
   req.session.returnTo = req.headers.referer || req.originalUrl || req.url;
   userController.getLogin(req, res, next);
});

// Login handle
router.post('/login', ensureNotAuthenticated, (req, res, next) => {
   userController.postLogin(req, res, next);
});

// Register Page
router.get('/register', ensureNotAuthenticated, (req, res, next) => {
   userController.getRegister(req, res, next);
});

// Register handle, uses validate middleware
router.post('/register', ensureNotAuthenticated, userValidationRules(), validate, async (req, res, next) => {
   userController.postRegister(req, res, next);
});

// reset password form and handler
router.get('/forgotPassword/:token', ensureNotAuthenticated, async (req, res, next) => {
   userController.getForgotPassword(req, res, next);
});

router.post('/forgotPassword/:token', changePasswordRules(), validate, async (req, res, next) => {
   userController.postForgotPassword(req, res, next);
});

// reset password link email form and handler
router.get('/sendResetLink', ensureNotAuthenticated, (req, res, next) => {
   userController.getResetLink(req, res, next);
});

router.post('/sendResetLink', async (req, res, next) => {
   userController.postResetLink(req, res, next);
});

// user activation resend form and handler
router.get('/sendActivationLink', ensureNotAuthenticated, (req, res, next) => {
   userController.getActivationLink(req, res, next);
});

router.post('/sendActivationLink', async (req, res, next) => {
   userController.postActivationLink(req, res, next);
});

// activate user link handler
router.get('/activate/:token', ensureNotAuthenticated, async (req, res, next) => {
   userController.getActivateLinkHandler(req, res, next);
});

// user profile routes and handler
router.get('/profile', ensureAuthenticated, async (req, res, next) => {
   userController.getProfile(req, res, next);
});

router.post('/profile', profileValidationRules(), validate, async (req, res, next) => {
   userController.postProfile(req, res, next);
});

// Logout handle
router.get('/logout', ensureAuthenticated, (req, res, next) => {
   userController.getLogout(req, res, next);
});

module.exports = router;
