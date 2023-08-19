const express = require('express');

const router = express.Router();

const {validate} = require('../helpers/validators/masterValidators');
const {ensureAuthenticated} = require('../helpers/auth-helper');
const patientTypeController = require('../controllers/patientTypeController');
const rateLimitter = require('../helpers/rate-limiter');
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');

// limit access to routes in this filename
router.use(rateLimitter);

// Main Page
router.get('/', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res, next) => {
   await patientTypeController.getPatientType(req, res, next);
});

// patientTypeValidationRules
router.post('/', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, validate, async (req, res, next) => {
   await patientTypeController.postPatientType(req, res, next);
});

// delete

router.post('/:id/delete', checkRoles([Roles.ADMIN, Roles.OWNER]), patientTypeController.deletePatientType);

module.exports = router;
