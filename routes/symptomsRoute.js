const express = require('express');

const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const symptomsController = require('../controllers/symptomsController');

const {validate} = require('../helpers/validators/symptomsValidator');

router.get(
   '/register',
   checkRoles([Roles.NURSE, Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await symptomsController.symptomRegister(req, res);
   }
);

router.get(
   '/symptomsReport',
   checkRoles([Roles.NURSE, Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await symptomsController.symptomTable(req, res);
   }
);
// save
router.post(
   '/register',
   checkRoles([Roles.NURSE, Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,

   async (req, res) => {
      await symptomsController.symptomsSave(req, res);
   }
);
// update
router.post(
   '/edit/:id',
   checkRoles([Roles.NURSE, Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,

   async (req, res) => {
      await symptomsController.updateSymptoms(req, res);
   }
);
// edit
router.get('/edit/:id', checkRoles([Roles.NURSE, Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]), async (req, res) => {
   await symptomsController.symptomsEdit(req, res);
});

router.post('/symptomsReport/:id/delete', symptomsController.symptomsDelete);

module.exports = router;
