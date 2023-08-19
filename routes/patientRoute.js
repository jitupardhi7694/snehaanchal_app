const express = require('express');

const multer = require('multer');
const {ensureAuthenticated} = require('../helpers/auth-helper');
const {patientValidationRules, validate} = require('../helpers/validators/patientValidator');

const Roles = require('../config/roles.json');

const {checkRoles} = require('../helpers/auth-helper');

const router = express.Router();
// multer
const upload = multer({dest: './public/uploads/'});
const patientController = require('../controllers/patientController');
// Patients Registration Form Page
router.get('/register', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await patientController.patientRegister(req, res);
});
// table
router.get('/registerTable', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await patientController.patientTable(req, res);
});

// delete
// router.get('/registerTable/:id', checkRoles([Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
//    await patientController.deletePatientTable(req, res);
// });

// save
router.post(
   '/register',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   upload.single('pic_filename'),
   patientValidationRules(),
   validate,
   async (req, res) => {
      await patientController.savePatient(req, res);
   }
);

// update
router.post(
   '/edit/:id',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   validate,
   upload.single('pic_filename'),
   async (req, res) => {
      await patientController.updatePatient(req, res);
   }
);

// edit
router.get('/edit/:id', ensureAuthenticated, checkRoles([Roles.ADMIN, Roles.OWNER]), async (req, res) => {
   await patientController.editPatient(req, res);
});

// DELETE

router.post(
   '/registerTable/:id/delete',
   checkRoles([Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   patientController.deletePatientTable
);

module.exports = router;
