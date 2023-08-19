const {QueryTypes} = require('sequelize');
const moment = require('moment');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');
const doctorPrescriptions = require('../models/doctorPrescriptionModel');

const prescriptionRegister = async (req, res) => {
   const patientTypes = await getPatientTypes();

   res.render('transaction/doctorPrescription', {
      rows: null,
      patientTypes,
      selectedPatientType: null,
      moment,
   });
};

//  table  report prescription Register

const prescriptionsTable = async (req, res) => {
   const registerprescriptionsTable = await getDoctorPrescriptionTable();

   res.render('transaction/doctorPrescriptionTable', {
      registerprescriptionsTable,
      moment,
   });
};

// save prescriptions
const prescriptionSave = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, note_date, symptom_name, medication_name, id} = req.body;

   try {
      const patientTypes = await getPatientTypes();

      const prescriptionsDoctor = await doctorPrescription(patient_id, note_date, symptom_name, medication_name);
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/doctorPrescription', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            selectedPatientType: req.body.patient_id,
         });
      }

      // check for duplicate religion name before inserting/updating
      if (prescriptionsDoctor > 0) {
         // Already Exists, return back to form
         errors.push({msg: 'This doctor prescription is already saved'});
         return res.render('transaction/doctorPrescription', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            selectedPatientType: req.body.patient_id,
            moment,
            prescriptionsDoctor,
         });
      }
      //   doctorPrescriptionTable.ejs
      // create new patient
      const saveDoctorPrescriptions = await doctorPrescriptions.create({
         patient_id,
         note_date,
         symptom_name,
         medication_name,
         ip_addr,
         user_id,
      });

      req.flash('success_msg', `Doctor Prescriptions Notes ${saveDoctorPrescriptions.patient_id}  is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};
// update

const updatePrescription = async (req, res) => {
   const {id} = req.params;
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, note_date, symptom_name, medication_name} = req.body;

   try {
      const patientTypes = await getPatientTypes();

      const existingDoctorPrescriptions = await doctorPrescriptions.findByPk(id);

      const prescriptionsDoctor = await doctorPrescription(patient_id, note_date, symptom_name, medication_name);
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/doctorPrescription', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            selectedPatientType: req.body.patient_id,
         });
      }

      // check for duplicate religion name before inserting/updating
      if (prescriptionsDoctor > 0) {
         // Already Exists, return back to form
         errors.push({msg: 'This  doctor prescription is already saved'});
         return res.render('transaction/doctorPrescription', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            selectedPatientType: req.body.patient_id,
            moment,
            prescriptionsDoctor,
         });
      }

      if (
         patient_id === existingDoctorPrescriptions.patient_id &&
         note_date === existingDoctorPrescriptions.note_date &&
         symptom_name === existingDoctorPrescriptions.symptom_name &&
         medication_name === existingDoctorPrescriptions.medication_name
      ) {
         // No changes, redirect back to dashboard
         return res.redirect('/dashboard');
      }

      if (prescriptionsDoctor > 0) {
         // Already exists, return back to form
         errors.push({msg: 'This doctor prescription is already saved'});
         return res.render('transaction/doctorPrescription', {
            patientTypes,
            errors,
            id,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            doctorPrescription,
            moment,
         });
      }

      const updatedPrescriptions = await existingDoctorPrescriptions.update({
         patient_id,
         note_date,
         symptom_name,
         medication_name,
         ip_addr,
         user_id,
      });

      if (updatedPrescriptions) {
         req.flash('success_msg', 'Doctor Prescription is successfully updated.');
      }
      return res.redirect('/doctor_prescription/doctorPrescriptionTable');
   } catch (err) {
      logger.error(err);
   }
   return null;
};

// edit prescriptions page

const editPrescription = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await doctorPrescriptions.findOne({where: {id}});
      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/doctor_prescription/doctorPrescriptionTable');
      }
      const patientTypes = await getPatientTypes();

      res.render('transaction/doctorPrescription', {
         id,
         rows,
         patientTypes,
         selectedPatientType: rows.patient_id,
         moment,
      });
   } catch (error) {
      return error.message;
   }
   return null;
};

const deleteDoctorPrescriptionData = async (req, res) => {
   await deleteDocotorPrescriptions(req, res);
};

async function getPatientTypes() {
   try {
      const rows = await db.query(`SELECT * FROM patients`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch patient from database", error);
      }
      return null;
   }
}
async function getDoctorPrescriptionTable() {
   try {
      const rows = await db.query(`SELECT * FROM doctor_prescription_table`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch doctor precription from database", error);
      }
      return null;
   }
}

async function deleteDocotorPrescriptions(req, res) {
   const {id} = req.params;
   try {
      const rows = await doctorPrescriptions.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/doctor_prescription/doctorPrescriptionTable');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/doctor_prescription/doctorPrescriptionTable');
         }
         logger.error("Can't delete prescription from database", error);
      }
      return null;
   }
}

async function doctorPrescription(patient_id, note_date, symptom_name, medication_name) {
   try {
      const rows = await db.query(
         `SELECT COUNT(*) AS count_overlap 
             FROM doctor_prescriptions 
             WHERE patient_id = :patient_id 
             AND note_date <= :note_date 
               AND symptom_name = :symptom_name
               AND medication_name = :medication_name
              `,
         {
            type: QueryTypes.SELECT,
            replacements: {
               patient_id,
               note_date,
               symptom_name,
               medication_name,
            },
         }
      );

      return rows[0].count_overlap;
   } catch (error) {
      logger.error("Can't fetch prescription from database", error);
      return null;
   }
}

module.exports = {
   prescriptionRegister,
   prescriptionSave,
   prescriptionsTable,
   editPrescription,
   updatePrescription,
   deleteDoctorPrescriptionData,
};
