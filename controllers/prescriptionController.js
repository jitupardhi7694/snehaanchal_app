const {QueryTypes} = require('sequelize');
const moment = require('moment');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');
const Prescriptions = require('../models/prescriptionsModel');

const prescriptionRegister = async (req, res) => {
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();
   const medicationsTypes = await getMedicationsType();

   res.render('transaction/prescriptions', {
      rows: null,
      patientTypes,
      staffTypes,
      medicationsTypes,
      selectedPatientType: null,
      selectedstaffTypes: null,
      selectedmedicationsTypes: null,
      moment,
   });
};

//  table  report prescription Register

const prescriptionsTable = async (req, res) => {
   const registerprescriptionsTable = await getprescriptionsTable();

   res.render('transaction/prescriptionsReport', {
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

   const {patient_id, staff_id, medication_id, start_date, end_date, id} = req.body;

   try {
      const staffTypes = await getStaffType();
      const patientTypes = await getPatientTypes();
      const medicationsTypes = await getMedicationsType();
      const prescriptions = await checkduplicate(patient_id, staff_id, medication_id, start_date, end_date);

      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/prescriptions', {
            errors,
            rows: req.body,
            id,
         });
      }
      // check for duplicate religion name before inserting/updating
      if (prescriptions > 0) {
         // Already Exists, return back to form
         errors.push({msg: 'This prescriptions is already saved'});
         return res.render('transaction/prescriptions', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            staffTypes,
            medicationsTypes,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            selectedmedicationsTypes: req.body.medication_id,
            moment,
            prescriptions,
         });
      }

      // create new patient
      const newPrescriptions = await Prescriptions.create({
         patient_id,
         staff_id,
         medication_id,
         start_date,
         end_date,
         ip_addr,
         user_id,
      });

      req.flash('success_msg', `Prescriptions ${newPrescriptions.patient_id}  is saved.`);
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
   const {patient_id, staff_id, medication_id, start_date, end_date} = req.body;
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();
   const medicationsTypes = await getMedicationsType();

   try {
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/prescriptions', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            staffTypes,
            medicationsTypes,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            selectedmedicationsTypes: req.body.medication_id,
         });
      }

      const existingPrescriptions = await Prescriptions.findByPk(id);
      if (!existingPrescriptions) {
         // Prescriptions not found, return back to form
         errors.push({msg: 'Prescriptions not found'});
         return res.render('transaction/prescriptions', {
            patientTypes,
            staffTypes,
            medicationsTypes,
            errors,
            id,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            selectedmedicationsTypes: req.body.medication_id,
            // Prescriptions,
            moment,
         });
      }

      if (
         patient_id === existingPrescriptions.patient_id &&
         staff_id === existingPrescriptions.staff_id &&
         medication_id === existingPrescriptions.medication_id &&
         start_date === existingPrescriptions.start_date &&
         end_date === existingPrescriptions.end_date
      ) {
         // No changes, redirect back to dashboard
         return res.redirect('/dashboard');
      }

      const prescriptions = await checkduplicate(patient_id, staff_id, medication_id, start_date, end_date);
      if (prescriptions > 0) {
         // Already exists, return back to form
         errors.push({msg: 'This prescriptions is already saved'});
         return res.render('transaction/prescriptions', {
            patientTypes,
            staffTypes,
            medicationsTypes,
            errors,
            id,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            selectedmedicationsTypes: req.body.medication_id,
            prescriptions,
            moment,
         });
      }

      const updatedPrescriptions = await existingPrescriptions.update({
         patient_id,
         staff_id,
         medication_id,
         start_date,
         end_date,
         ip_addr,
         user_id,
      });

      if (updatedPrescriptions) {
         req.flash('success_msg', 'Draft data successfully updated.');
      }
      return res.redirect('/prescriptions/prescriptionsReport');
   } catch (err) {
      logger.error(err);
   }
   return null;
};

// edit prescriptions page

const editPrescription = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Prescriptions.findOne({where: {id}});
      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/prescriptions/prescriptionsReport');
      }
      const patientTypes = await getPatientTypes();
      const staffTypes = await getStaffType();

      const {isActive} = staffTypes;
      const medicationsTypes = await getMedicationsType();

      res.render('transaction/prescriptions', {
         id,
         rows,
         patientTypes,
         staffTypes,
         medicationsTypes,
         selectedPatientType: rows.patient_id,
         selectedstaffTypes: rows.staff_id,
         selectedmedicationsTypes: rows.medication_id,
         moment,
         isActive,
      });
   } catch (error) {
      return error.message;
   }
   return null;
};

const deletePrescriptionData = async (req, res) => {
   await deleteprescriptions(req, res);
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

async function getStaffType() {
   try {
      const rows = await db.query(`SELECT * FROM staff`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch staff from database", error);
      }
      return null;
   }
}

async function getMedicationsType() {
   try {
      const rows = await db.query(`SELECT * FROM medications`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch medications from database", error);
      }
      return null;
   }
}

async function deleteprescriptions(req, res) {
   const {id} = req.params;
   try {
      const rows = await Prescriptions.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/prescriptions/prescriptionsReport');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/prescriptions/prescriptionsReport');
         }
         logger.error("Can't delete prescription from database", error);
      }
      return null;
   }
}

async function getprescriptionsTable() {
   try {
      const rows = await db.query(`Select * from prescription_data `, {
         type: QueryTypes.SELECT,
      });
      // console.log('rows', rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch Registered prescription from database", error);
      }
      return null;
   }
}

async function checkduplicate(patient_id, staff_id, medication_id, start_date, end_date) {
   try {
      const rows = await db.query(
         `SELECT COUNT(*) AS count_overlap 
           FROM prescriptions 
           WHERE patient_id = :patient_id 
             AND staff_id = :staff_id 
             AND medication_id = :medication_id 
             AND start_date <= :start_date 
             AND end_date >= :end_date`,
         {
            type: QueryTypes.SELECT,
            replacements: {
               patient_id,
               staff_id,
               medication_id,
               start_date,
               end_date,
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
   deletePrescriptionData,
};
