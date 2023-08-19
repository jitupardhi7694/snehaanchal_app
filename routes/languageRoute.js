const express = require('express');

const router = express.Router();
const {languageValidationRules, validate} = require('../helpers/validators/masterValidators');
const {ensureAuthenticated} = require('../helpers/auth-helper');
const languageController = require('../controllers/languageController');
const rateLimiter = require('../helpers/rate-limiter');

const Roles = require('../config/roles.json');
const {checkRoles} = require('../helpers/auth-helper');

// limit access to routes in this filename
router.use(rateLimiter);

// Main Page
router.get('/', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res, next) => {
   await languageController.getLanguage(req, res, next);
});

router.post(
   '/',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   languageValidationRules(),
   validate,
   (req, res, next) => {
      languageController.postLanguage(req, res, next);
   }
);
// delete

router.post('/:id/delete', checkRoles([Roles.ADMIN, Roles.OWNER]), languageController.deleteLanguages);

module.exports = router;
