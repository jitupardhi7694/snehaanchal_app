const express = require('express');

const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const {validate} = require('../helpers/validators/nurseValidator');
const nurseController = require('../controllers/nurseController');

router.get('/register', checkRoles([Roles.NURSE, Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await nurseController.nurseRegister(req, res);
});

router.get(
   '/nurseTable',
   checkRoles([Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await nurseController.nurseTable(req, res);
   }
);
// save
router.post(
   '/register',
   checkRoles([Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,

   validate,

   async (req, res) => {
      await nurseController.nurseSave(req, res);
   }
);
// update
router.post(
   '/edit/:id',
   checkRoles([Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,
   async (req, res) => {
      await nurseController.nurseUpdate(req, res);
   }
);
// edit
router.get('/edit/:id', checkRoles([Roles.NURSE, Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await nurseController.nurseEdit(req, res);
});
// delete
router.post('/nurseTable/:id/delete', ensureAuthenticated, nurseController.nurseDelete);

module.exports = router;
