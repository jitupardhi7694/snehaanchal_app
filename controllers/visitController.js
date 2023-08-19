const {QueryTypes} = require('sequelize');

const moment = require('moment');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');
const Visits = require('../models/visitModel');

// register

const visitRegister = async (req, res) => {
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();

   res.render('transaction/visits', {
      rows: null,
      patientTypes,
      staffTypes,
      selectedPatientType: null,
      selectedstaffTypes: null,
      moment,
   });
};

// visit table
const visitTable = async (req, res) => {
   const registerVisitsTable = await getVisitTable();

   res.render('transaction/visitTable', {
      registerVisitsTable,
      moment,
   });
};

// save visit
const visitSave = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, staff_id, visit_date, notes, id} = req.body;

   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();
   try {
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/visits', {
            errors,
            id,
            patientTypes,
            staffTypes,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            moment,
         });
      }

      const visit = await checkduplicate(patient_id, staff_id, visit_date);

      if (visit > 0) {
         // Already Exists, return back to form
         errors.push({msg: 'This visit is already saved'});
         return res.render('transaction/visits', {
            patientTypes,
            staffTypes,
            errors,
            id,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            visit,
            moment,
         });
      }
      // Determine the value of the draft field based on which button was clicked

      // create new patient
      const newVisits = await Visits.create({
         patient_id,
         staff_id,
         visit_date,
         notes,
         ip_addr,
         user_id,
      });
      // console.log('newVisits', newVisits);
      req.flash('success_msg', `Visits ${newVisits.patient_id}  is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// update visit

const visitUpdate = async (req, res) => {
   const {id} = req.params;

   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, staff_id, visit_date, notes} = req.body;
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();

   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      return res.render('transaction/visits', {
         errors,
         id,
         rows: req.body,
         patientTypes,
         staffTypes,
         selectedPatientType: req.body.patient_id,
         selectedstaffTypes: req.body.staff_id,
      });
   }

   try {
      const existingVisit = await Visits.findByPk(id);
      if (!existingVisit) {
         // Visit not found, return back to form
         errors.push({msg: 'Visit not found'});
         return res.render('transaction/visits', {
            patientTypes,
            staffTypes,
            errors,
            id,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            // visit,
            moment,
         });
      }

      if (
         patient_id === existingVisit.patient_id &&
         staff_id === existingVisit.staff_id &&
         visit_date === existingVisit.visit_date
      ) {
         // No changes, redirect back to dashboard
         return res.redirect('/dashboard');
      }

      const visit = await checkduplicate(patient_id, staff_id, visit_date);
      if (visit > 0) {
         // Already exists, return back to form
         errors.push({msg: 'This visit is already saved'});
         return res.render('transaction/visits', {
            patientTypes,
            staffTypes,
            errors,
            id,
            rows: req.body,
            selectedPatientType: req.body.patient_id,
            selectedstaffTypes: req.body.staff_id,
            visit,
            moment,
         });
      }

      const updatedVisits = await existingVisit.update({
         patient_id,
         staff_id,
         visit_date,
         notes,
         ip_addr,
         user_id,
      });

      if (updatedVisits) {
         req.flash('success_msg', 'Data successfully updated.');
      }
      return res.redirect('/dashboard');
   } catch (err) {
      logger.error(err);
   }
   return null;
};

// edit
const visitEdit = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Visits.findOne({where: {id}});

      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/visits/visitTable');
      }

      const patientTypes = await getPatientTypes();
      const staffTypes = await getStaffType();

      res.render('transaction/visits', {
         id,
         rows,
         patientTypes,
         staffTypes,
         selectedPatientType: rows.patient_id,
         selectedstaffTypes: rows.staff_id,
         moment,
         draft: rows?.draft || 0,
         disableNotes: rows?.draft === 1 || false,
      });
   } catch (error) {
      return error.message;
   }
   return null;
};

// delete visit

const visitDelete = async (req, res) => {
   await deletevisits(req, res);
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

async function getVisitTable() {
   try {
      const rows = await db.query(`SELECT * FROM visit_data `, {
         type: QueryTypes.SELECT,
      });
      //  console.log('rows', rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch Registered Visits from database", error);
      }
      return null;
   }
}

async function deletevisits(req, res) {
   const {id} = req.params;
   try {
      const rows = await Visits.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/visits/visitTable');
   } catch (error) {
      if (error) {
         console.log('error =>', error);
         logger.error("Can't delete Visits  Type from database", error);
      }
      return null;
   }
}

async function checkduplicate(patient_id, staff_id, visit_date) {
   try {
      const rows = await db.query(
         `SELECT COUNT(*) AS count_overlap 
         FROM visits 
         WHERE patient_id = :patient_id  
           AND staff_id = :staff_id
           AND visit_date = :visit_date
         `,
         {
            type: QueryTypes.SELECT,
            replacements: {
               patient_id,
               staff_id,
               visit_date,
            },
         }
      );

      return rows[0].count_overlap;
   } catch (error) {
      logger.error("Can't fetch visit from database", error);
      return null;
   }
}

module.exports = {visitRegister, visitEdit, visitSave, visitDelete, visitUpdate, visitTable};
