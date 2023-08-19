const express = require('express');

const router = express.Router();

const {staffValidationRules} = require('../helpers/validators/masterValidators');

const {ensureAuthenticated} = require('../helpers/auth-helper');
const rateLimiter = require('../helpers/rate-limiter');

const Roles = require('../config/roles.json');
const staffController = require('../controllers/staffController');
const {checkRoles} = require('../helpers/auth-helper');

router.use(rateLimiter);

router.get('/register', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await staffController.staffRegister(req, res);
});

// sataff report router

router.get(
   '/registerTable',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   staffValidationRules(),
   async (req, res) => {
      await staffController.staffTable(req, res);
   }
);

// staff report delete router
// DELETE
router.post(
   '/registerTable/:id/delete',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   staffController.staffDeleteData
);

// save data

router.post(
   '/register',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   staffValidationRules(),
   async (req, res) => {
      await staffController.staffSave(req, res);
   }
);

// edit staff data router

router.get('/edit/:id', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await staffController.staffEdit(req, res);
});

// update staff data

router.post(
   '/edit/:id',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   staffValidationRules(),
   async (req, res) => {
      await staffController.staffUpdate(req, res);
   }
);

module.exports = router;
