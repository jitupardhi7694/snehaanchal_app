const express = require('express');

const router = express.Router();
const {userRoleValidationRules, validate} = require('../helpers/validators/masterValidators');
const {ensureAuthenticated} = require('../helpers/auth-helper');
const userRolesController = require('../controllers/userRolesController');
const rateLimiter = require('../helpers/rate-limiter');
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');

// limit access to routes in this filename
router.use(rateLimiter);

// Main Page
router.get('/', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res, next) => {
   await userRolesController.getUserRole(req, res, next);
});

router.post(
   '/',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   userRoleValidationRules(),
   validate,
   (req, res, next) => {
      userRolesController.postUserRole(req, res, next);
   }
);

// // delete UserRoles query

router.post('/:id/delete', checkRoles([Roles.ADMIN, Roles.OWNER]), userRolesController.deleteRoles);

module.exports = router;
