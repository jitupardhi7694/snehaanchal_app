const express = require('express');

const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth-helper');
const rateLimiter = require('../helpers/rate-limiter');

const Roles = require('../config/roles.json');
const {checkRoles} = require('../helpers/auth-helper');

const medicationController = require('../controllers/medicationController');
// limit access to routes in this filename

router.use(rateLimiter);

router.get(
   '/register',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await medicationController.medicationRegister(req, res);
   }
);
// console.log('data on server');

// sataff report router

router.get(
   '/registerTable',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await medicationController.medicationTable(req, res);
   }
);
// staff report delete router

router.post(
   '/registerTable/:id/delete',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   medicationController.deleteMedicationData
);
// save data

router.post(
   '/register',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,

   async (req, res) => {
      await medicationController.saveMedication(req, res);
   }
);

// edit staff data router

// edit

router.get('/edit/:id', checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]), async (req, res) => {
   await medicationController.editMedication(req, res);
});

// update staff data

// update
router.post(
   '/edit/:id',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),

   async (req, res) => {
      await medicationController.updateMedication(req, res);
   }
);

module.exports = router;
