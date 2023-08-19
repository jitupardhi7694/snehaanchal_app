const express = require('express');

const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const visitController = require('../controllers/visitController');
const {visitsValidationRules, validate} = require('../helpers/validators/visitsValidator');

// register

router.get(
   '/register',
   checkRoles([Roles.COUNSELLOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await visitController.visitRegister(req, res);
   }
);
// table
router.get(
   '/visitTable',
   checkRoles([Roles.COUNSELLOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await visitController.visitTable(req, res);
   }
);

// save
router.post(
   '/register',
   checkRoles([Roles.COUNSELLOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   visitsValidationRules(),
   validate,

   async (req, res) => {
      await visitController.visitSave(req, res);
   }
);
// update
router.post(
   '/edit/:id',
   checkRoles([Roles.COUNSELLOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,

   async (req, res) => {
      await visitController.visitUpdate(req, res);
   }
);

// edit
router.get(
   '/edit/:id',
   ensureAuthenticated,
   checkRoles([Roles.COUNSELLOR, Roles.ADMIN, Roles.OWNER]),
   async (req, res) => {
      await visitController.visitEdit(req, res);
   }
);

// delete
router.post(
   '/visitTable/:id/delete',

   checkRoles([Roles.COUNSELLOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   visitController.visitDelete
);

module.exports = router;
