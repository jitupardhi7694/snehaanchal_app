const {QueryTypes} = require('sequelize');

const {Op} = require('sequelize');
const moment = require('moment');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');

const Counseller = require('../models/counsellerModel');

// counseller Register

const counsellerRegister = async (req, res) => {
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();

   res.render('transaction/counseller', {
      rows: null,
      patientTypes,
      staffTypes,
      selectedPatientType: null,
      selectedstaffTypes: null,
      moment,
   });
};

const counsellerTable = async (req, res) => {
   const registercounsellerTable = await getcounsellerTable();

   res.render('transaction/counsellerTable', {
      registercounsellerTable,
      moment,
      isAdmin: true,
   });
};
// save
const saveCounseller = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();
   const {patient_id, staff_id, counselling_date, counselling_notes, id, action, draft} = req.body;
   const rows = await Counseller.findAll();

   try {
      // const rows = req.body;

      // const {counselling_date, id} = req.body;
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('transaction/counseller', {
            errors,
            rows,
            draft,
            patientTypes,
            staffTypes,
            selectedPatientType: rows.patient_id,
            selectedstaffTypes: rows.staff_id,
         });
      }

      const counseller = await Counseller.findOne({
         where: {patient_id, id: {[Op.ne]: id}},
      });

      if (counseller) {
         // Already Exists, return back to form
         errors.push({msg: 'This counseller is already saved'});
         return res.render('transaction/counseller', {
            errors,
            id,
            rows,
            draft,
            patientTypes,
            staffTypes,
            selectedPatientType: rows.patient_id,
            selectedstaffTypes: rows.staff_id,
         });
      }
      // Determine the value of the draft field based on which button was clicked

      const draftValue = action === 'draft' ? 1 : 0;
      // create new patient
      const newCounseller = await Counseller.create({
         patient_id,
         staff_id,
         counselling_date,
         counselling_notes,
         ip_addr,
         user_id,
         draft: draftValue, // Set the value of the draft field
      });
      // console.log('newCounseller', newCounseller);
      req.flash('success_msg', `Counseller ${newCounseller.patient_id}  is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// update

const updateCounseller = async (req, res) => {
   const {id} = req.params;
   const rows = req.body;
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, staff_id, counselling_date, counselling_notes, draft} = req.body;
   const patientTypes = await getPatientTypes();
   const staffTypes = await getStaffType();
   // const rows = await Counseller.findAll();

   const {action} = req.body; // Get the value of the action button
   const draftValue = action === 'draft' ? 1 : 0;
   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      return res.render('transaction/counseller', {
         errors,
         id,
         rows,
         patientTypes,
         staffTypes,
         selectedPatientType: rows.patient_id,
         selectedstaffTypes: rows.staff_id,
         draft,
      });
   }

   const counseller = await Counseller.findOne({
      where: {patient_id, id: {[Op.ne]: id}},
   });

   if (counseller) {
      // Already Exists, return back to form
      errors.push({msg: 'This counseller is already saved'});
      return res.render('transaction/counseller', {
         errors,
         id,
         rows,
         moment,
         patientTypes,
         staffTypes,
         selectedPatientType: rows.patient_id,
         selectedstaffTypes: rows.staff_id,
         draft,
      });
   }

   try {
      if (id !== '') {
         const updatedCounseller = await Counseller.update(
            {
               patient_id,
               staff_id,
               counselling_date,
               counselling_notes,
               draft: draftValue, // Set the value of the draft field
               ip_addr,
               user_id,
            },
            {where: {id}}
         );
         //   console.log('updatedPatient', updatedPatient);
         if (updatedCounseller) {
            req.flash('success_msg', 'Draft Data Successfully  updated.');
         }
         return res.redirect('/dashboard');
      }
   } catch (err) {
      logger.error(err);
   }

   return null;
};

// edit

const editCounseller = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Counseller.findOne({where: {id}});

      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/counseller/counsellerTable');
      }
      const patientTypes = await getPatientTypes();
      const staffTypes = await getStaffType();

      res.render('transaction/counseller', {
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

const deleteCounsellerData = async (req, res) => {
   await deletecounseller(req, res);
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

// async function getcounsellerTable() {
//    try {
//       const rows = await db.query(`SELECT * FROM counseller_data;`, {
//          type: QueryTypes.SELECT,
//       });
//       //  console.log('rows', rows);
//       return rows;
//    } catch (error) {
//       if (error) {
//          logger.error("Can't fetch Registered Counseller from database", error);
//       }
//       return null;
//    }
// }

async function getcounsellerTable() {
   try {
      const rows = await db.query(`SELECT * FROM counseller_data`, {
         type: QueryTypes.SELECT,
      });
      // console.log('rows = >', rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch Registered counseller from database", error);
      }
      return null;
   }
}

async function deletecounseller(req, res) {
   const {id} = req.params;
   try {
      const rows = await Counseller.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/counseller/counsellerTable');
   } catch (error) {
      if (error) {
         console.log('error =>', error);
         logger.error("Can't delete Counseller  Type from database", error);
      }
   }
   return null;
}

module.exports = {
   counsellerRegister,
   counsellerTable,
   updateCounseller,
   editCounseller,
   saveCounseller,
   deleteCounsellerData,
};
