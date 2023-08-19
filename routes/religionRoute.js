const express = require('express');

const router = express.Router();
const {religionValidationRules, validate} = require('../helpers/validators/masterValidators');
const {checkRoles} = require('../helpers/auth-helper');
const religionController = require('../controllers/religionController');
const rateLimiter = require('../helpers/rate-limiter');
const Roles = require('../config/roles.json');

// limit access to routes in this filename
router.use(rateLimiter);

router.use(express.urlencoded({extended: true}));
// Main Page
router.get('/', checkRoles([Roles.ADMIN, Roles.OWNER]), async (req, res, next) => {
   await religionController.getReligion(req, res, next);
});

router.post('/', checkRoles([Roles.ADMIN, Roles.OWNER]), religionValidationRules(), validate, (req, res, next) => {
   religionController.postReligion(req, res, next);
});

// delete religion query
router.post('/:id/delete', checkRoles([Roles.ADMIN, Roles.OWNER]), religionController.deleteReligion);

module.exports = router;
