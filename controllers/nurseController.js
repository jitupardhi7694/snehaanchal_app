const {QueryTypes} = require('sequelize');

const moment = require('moment');
const {Op} = require('sequelize');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');

const Nurse = require('../models/nurseModel');

// register nurse

const nurseRegister = async (req, res) => {
   try {
      const patientTypes = await getPatientTypes();
      const staffTypes = await getStaffType();
      const getPrescription = await getPrescriptionData();

      res.render('transaction/nurse', {
         rows: null,
         patientTypes,
         staffTypes,
         selectedPatientType: null,
         selectedstaffTypes: null,
         selectedmedicationsTypes: getPrescription.medication_name,
         getPrescription,
         moment,
      });
   } catch (error) {
      logger.error("Can't fetch data from database", error);
      res.status(500).send('Internal Server Error');
   }
};

const nurseTable = async (req, res) => {
   const registerNurseTable = await getnurseTable();

   res.render('transaction/nurseTable', {
      registerNurseTable,
      moment,
   });
};
// save

const nurseSave = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, staff_id, nurse_date, nurse_notes, id} = req.body;
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();

   try {
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/nurse', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            staffTypes,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            moment,
         });
      }

      // check for duplicate Nurse name before inserting/updating
      const nurse = await Nurse.findOne({
         where: {patient_id, id: {[Op.ne]: id}},
      });
      // Already Exists, return back to form
      if (nurse) {
         errors.push({msg: 'This nurse is already saved'});
         return res.render('transaction/nurse', {
            errors,
            id,
            rows: req.body,
            patientTypes,
            staffTypes,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            moment,
         });
      }

      // create new patient
      const newNurse = await Nurse.create({
         patient_id,
         staff_id,
         nurse_date,
         nurse_notes,
         ip_addr,
         user_id,
         // Set the value of the draft field
      });
      // console.log('newNurse', newNurse);
      req.flash('success_msg', `Nurse ${newNurse.patient_id}  is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// update

const nurseUpdate = async (req, res) => {
   const {id} = req.params;
   const rows = req.body;
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, staff_id, nurse_date, nurse_notes} = req.body;
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();

   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      return res.render('transaction/nurse', {
         errors,
         id,
         rows: req.body,
         patientTypes,
         staffTypes,
         selectedPatientType: req.body.patient_id,
         selectedstaffTypes: req.body.staff_id,
         moment,
      });
   }

   // check for duplicate Nurse name before inserting/updating
   const nurse = await Nurse.findOne({
      where: {patient_id, id: {[Op.ne]: id}},
   });
   // Already Exists, return back to form
   if (nurse) {
      errors.push({msg: 'This nurse is already saved'});
      return res.render('transaction/nurse', {
         errors,
         id,
         rows: req.body,
         patientTypes,
         staffTypes,
         selectedPatientType: req.body.patient_id,
         selectedstaffTypes: req.body.staff_id,
         moment,
      });
   }

   try {
      if (id !== '') {
         const updatedNurse = await Nurse.update(
            {
               patient_id,
               staff_id,
               nurse_date,
               nurse_notes,
               ip_addr,
               user_id,
            },
            {where: {id}}
         );
         //   console.log('updatedPatient', updatedPatient);
         if (updatedNurse) {
            req.flash('success_msg', ' Data Successfully  updated.');
         }
         return res.redirect('/nurse/nurseTable');
      }
   } catch (err) {
      logger.error(err);
   }

   return null;
};

// edit

const nurseEdit = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Nurse.findOne({where: {id}});

      if (rows === null) {
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/nurse/nurseTable');
      }
      const patientTypes = await getPatientTypes();
      const staffTypes = await getStaffType();

      res.render('transaction/nurse', {
         id,
         rows,
         patientTypes,
         staffTypes,
         selectedPatientType: rows.patient_id,
         selectedstaffTypes: rows.staff_id,
         moment,
      });
   } catch (error) {
      return error.message;
   }
   return null;
};

// delete
const nurseDelete = async (req, res) => {
   await deletenurse(req, res);
};

async function getPatientTypes() {
   try {
      const rows = await db.query(`SELECT * FROM patient_data`, {
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

async function getnurseTable() {
   try {
      const rows = await db.query(`SELECT * FROM nurse_data`, {
         type: QueryTypes.SELECT,
      });
      //  console.log('rows', rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch Registered Nurse from database", error);
      }
      return null;
   }
}

async function getPrescriptionData() {
   try {
      const rows = await db.query(`SELECT * FROM patient_prescription_data;`, {
         type: QueryTypes.SELECT,
      });
      return rows;
   } catch (error) {
      logger.error("Can't fetch patient prescription data from database", error);
      return null;
   }
}

async function deletenurse(req, res) {
   const {id} = req.params;
   try {
      const rows = await Nurse.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/nurse/nurseTable');
   } catch (error) {
      if (error) {
         console.log('error =>', error);
         logger.error("Can't delete Nurse  Type from database", error);
      }
   }
   return null;
}

module.exports = {nurseRegister, nurseSave, nurseTable, nurseEdit, nurseUpdate, nurseDelete};
