const express = require('express');
const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const prescriptionController = require('../controllers/doctorPrescriptionController');
const {doctorPrescriptionsValidationRules, validate} = require('../helpers/validators/doctorPrescriptionValidator');

router.get(
   '/register',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await prescriptionController.prescriptionRegister(req, res);
   }
);

router.get(
   '/doctorPrescriptionTable',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await prescriptionController.prescriptionsTable(req, res);
   }
);
// save
router.post(
   '/register',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   doctorPrescriptionsValidationRules(),
   validate,

   async (req, res) => {
      await prescriptionController.prescriptionSave(req, res);
   }
);

// update
router.post(
   '/edit/:id',
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,
   doctorPrescriptionsValidationRules(),

   async (req, res) => {
      await prescriptionController.updatePrescription(req, res);
   }
);
// edit
router.get(
   '/edit/:id',
   ensureAuthenticated,
   checkRoles([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN, Roles.OWNER]),
   async (req, res) => {
      await prescriptionController.editPrescription(req, res);
   }
);

router.post(
   '/doctorPrescriptionTable/:id/delete',
   ensureAuthenticated,
   prescriptionController.deleteDoctorPrescriptionData
);

module.exports = router;
