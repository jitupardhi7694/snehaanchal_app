const express = require('express');

const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const {counsellerValidationRules, validate} = require('../helpers/validators/counsellingValidator');
const counsellerController = require('../controllers/counsellerController');

router.get(
   '/register',
   checkRoles([Roles.COUNSELLOR, Roles.OWNER, Roles.ADMIN]),
   ensureAuthenticated,
   async (req, res) => {
      await counsellerController.counsellerRegister(req, res);
   }
);

router.get('/counsellerTable', checkRoles([Roles.COUNSELLOR]), ensureAuthenticated, async (req, res) => {
   await counsellerController.counsellerTable(req, res);
});
// save
router.post(
   '/register',
   checkRoles([Roles.COUNSELLOR, Roles.OWNER, Roles.ADMIN]),
   ensureAuthenticated,
   counsellerValidationRules(),
   validate,

   async (req, res) => {
      await counsellerController.saveCounseller(req, res);
   }
);
// update
router.post(
   '/edit/:id',
   checkRoles([Roles.COUNSELLOR]),
   ensureAuthenticated,
   validate,

   async (req, res) => {
      await counsellerController.updateCounseller(req, res);
   }
);
// edit
router.get('/edit/:id', checkRoles([Roles.COUNSELLOR]), async (req, res) => {
   await counsellerController.editCounseller(req, res);
});

router.post('/counsellerTable/:id/delete', counsellerController.deleteCounsellerData);

module.exports = router;
