const express = require('express');
const multer = require('multer');

const {ensureAuthenticated} = require('../helpers/auth-helper');

const router = express.Router();
const {checkRoles} = require('../helpers/auth-helper');
const Roles = require('../config/roles.json');
const {validate} = require('../helpers/validators/patientDocValidator');
const patientDocController = require('../controllers/patientDocController');

// multer
const upload = multer({dest: './public/patientDocuments/'});
router.get('/register', checkRoles([Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await patientDocController.patientDocRegister(req, res);
});

router.get(
   '/patientDocTable',
   checkRoles([Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   async (req, res) => {
      await patientDocController.patientDocTable(req, res);
   }
);
// save
router.post(
   '/register',
   checkRoles([Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   upload.single('docImage'),
   validate,
   async (req, res) => {
      await patientDocController.savePatientDocs(req, res);
   }
);
// update
router.post(
   '/edit/:id',
   checkRoles([Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]),
   ensureAuthenticated,
   upload.single('docImage'),
   validate,
   async (req, res) => {
      await patientDocController.updatedPatientDoc(req, res);
   }
);
// edit
router.get('/edit/:id', checkRoles([Roles.DOCTOR, Roles.ADMIN, Roles.OWNER]), ensureAuthenticated, async (req, res) => {
   await patientDocController.editPatientDoc(req, res);
});
// delete
router.post('/patientDocTable/:id/delete', ensureAuthenticated, patientDocController.deletePatientDocTable);

module.exports = router;
