const express = require('express');

const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const {validate} = require('../helpers/validators/counsellingValidator');
const counsellerAdminController = require('../controllers/counsellerAdminController');

router.get('/counsellerTableAdmin', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await counsellerAdminController.counsellerTable(req, res);
});

// update
router.post(
   '/edit/:id',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,

   async (req, res) => {
      await counsellerAdminController.updateCounseller(req, res);
   }
);
// edit
router.get('/edit/:id', checkRoles([Roles.ADMIN, Roles.OWNER]), async (req, res) => {
   await counsellerAdminController.editCounseller(req, res);
});

router.post('/counsellerTableAdmin/:id/delete', counsellerAdminController.deleteCounsellerData);

module.exports = router;
