const {Op} = require('sequelize');
const moment = require('moment');
const {QueryTypes} = require('sequelize');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');

const Patient = require('../models/patientModel');

// Patients Registration Form Page

const patientRegister = async (req, res) => {
   const patientTypes = await getPatientTypes();
   const religions = await getReligions();
   const languages = await getLanguages();
   const rows = await Patient.findAll();
   res.render('patientPages/registerPatient', {
      rows,
      patientTypes,
      religions,
      languages,
      selectedPatientType: null,
      selectedReligion: null,
      selectedLanguage: null,
      selectedGender: null,
      selectedAGender: null,
      img: null,
   });
};

const patientTable = async (req, res) => {
   const registerPatientTable = await getregisterPatientTable(); // search for the patient data
   res.render('patientPages/registrationPatientData', {
      registerPatientTable,
      moment,
   });
   return null;
};

const deletePatientTable = async (req, res) => {
   await deletePatient(req, res);
};

// save
const savePatient = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const is_Active = req.body.is_Active ? 1 : 0;
   const {
      name,
      patient_type_id,
      age,
      gender,
      reg_date,
      reg_id,
      ref_by,
      local_address,
      local_city,
      local_landmark,
      local_phone1,
      local_phone2,
      permanent_address,
      permanent_city,
      permanent_landmark,
      permanent_phone1,
      permanent_phone2,
      fathers_name,
      mothers_name,
      spouse_name,
      religion,
      language,
      occupation,
      family_occupation,
      family_earning,
      remarks,
      buddy_name,
      buddy_relation,
      buddy_address,
      buddy_city,
      buddy_phone,
      buddy1_name,
      buddy1_relation,
      buddy1_address,
      buddy1_city,
      buddy1_phone,
      admit_name,
      admit_relation,
      admit_address,
      admit_phone,
      admit_age,
      admit_gender,
   } = req.body;

   try {
      const {aadhar, id} = req.body;
      // const rows = await getregisterPatientTable();
      const patientTypes = await getPatientTypes();
      const religions = await getReligions();
      const languages = await getLanguages();
      const rows = await Patient.findAll();
      //   console.log(' req.file', req.file);
      const {originalname, filename} = req.file;
      // console.log(' req.body.aadhar', req.body.aadhar);
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         // return to form with errors
         return res.render('patientPages/registerPatient', {
            errors,
            patientTypes,
            religions,
            languages,
            rows,
         });
      }

      // check for duplicate religion name before inserting/updating
      const patient = await Patient.findOne({
         where: {aadhar, id: {[Op.ne]: id}},
      });
      if (patient) {
         // Already Exists, return back to form
         errors.push({msg: 'This patient is already saved'});
         return res.render('patientPages/registerPatient', {
            errors,
            id,
            img: null,
            rows,
            patientTypes,
            languages,
            religions,
            selectedPatientType: rows.patient_type_id,
            selectedReligion: rows.religion,
            selectedLanguage: rows.language,
            selectedGender: rows.gender,
            selectedAGender: rows.admit_gender,
         });
      }

      // create new patient
      const newPatient = await Patient.create({
         name,
         patient_type_id,
         age,
         gender,
         reg_date,
         reg_id,
         aadhar,
         pic_filename: originalname,
         image_data: filename,
         ref_by,
         local_address,
         local_city,
         local_landmark,
         local_phone1,
         local_phone2,
         permanent_address,
         permanent_city,
         permanent_landmark,
         permanent_phone1,
         permanent_phone2,
         fathers_name,
         mothers_name,
         spouse_name,
         religion,
         language,
         occupation,
         family_occupation,
         family_earning,
         remarks,
         buddy_name,
         buddy_relation,
         buddy_address,
         buddy_city,
         buddy_phone,
         buddy1_name,
         buddy1_relation,
         buddy1_address,
         buddy1_city,
         buddy1_phone,
         admit_name,
         admit_relation,
         admit_address,
         admit_phone,
         admit_age,
         admit_gender,

         isActive: is_Active,
         ip_addr,
         user_id,
      });
      //  console.log('newPatient', newPatient);
      req.flash('success_msg', `Patient ${newPatient.name} is saved. `);
      return res.redirect('/patient_docs/register');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// update

const updatePatient = async (req, res) => {
   const {id} = req.params;
   const rows = req.body;
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const is_Active = req.body.is_Active ? 1 : 0;

   const {
      name,
      patient_type_id,
      age,
      gender,
      reg_date,
      reg_id,
      aadhar,
      ref_by,
      local_address,
      local_city,
      local_landmark,
      local_phone1,
      local_phone2,
      permanent_address,
      permanent_city,
      permanent_landmark,
      permanent_phone1,
      permanent_phone2,
      fathers_name,
      mothers_name,
      spouse_name,
      religion,
      language,
      occupation,
      family_occupation,
      family_earning,
      remarks,
      buddy_name,
      buddy_relation,
      buddy_address,
      buddy_city,
      buddy_phone,
      buddy1_name,
      buddy1_relation,
      buddy1_address,
      buddy1_city,
      buddy1_phone,
      admit_name,
      admit_relation,
      admit_address,
      admit_phone,
      admit_age,
      admit_gender,
   } = req.body;

   const patientTypes = await getPatientTypes();
   const religions = await getReligions();
   const languages = await getLanguages();
   const imageData = await Patient.findByPk(id);

   const {originalname, filename} = req.file || {};
   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      return res.render('patientPages/registerPatient', {
         errors,

         rows: req.body,
         patientTypes,
         languages,
         religions,
         selectedPatientType: req.body.patient_type_id,
         selectedReligion: req.body.religion,
         selectedLanguage: req.body.language,
         selectedGender: req.body.gender,
         selectedAGender: req.body.admit_gender,
         img: imageData.image_data,
      });
   }

   // check for duplicate religion name before inserting/updating
   const patient = await Patient.findOne({
      where: {aadhar, id: {[Op.ne]: id}},
   });

   if (patient) {
      // Already Exists, return back to form
      errors.push({msg: 'This patient is already saved'});
      return res.render('patientPages/registerPatient', {
         errors,
         id,
         rows: req.body,
         patientTypes,
         religions,
         languages,
         selectedPatientType: rows.patient_type_id,
         selectedReligion: rows.religion,
         selectedLanguage: rows.language,
         selectedGender: rows.gender,
         selectedAGender: rows.admit_gender,
         img: imageData.image_data,
      });
   }

   try {
      if (id !== '') {
         const updatedPatient = await Patient.update(
            {
               name,
               patient_type_id,
               age,
               gender,
               reg_date,
               reg_id,
               aadhar,
               pic_filename: originalname || req.body.pic_filename,
               image_data: filename || imageData.image_data,
               ref_by,
               local_address,
               local_city,
               local_landmark,
               local_phone1,
               local_phone2,
               permanent_address,
               permanent_city,
               permanent_landmark,
               permanent_phone1,
               permanent_phone2,
               fathers_name,
               mothers_name,
               spouse_name,
               religion,
               language,
               occupation,
               family_occupation,
               family_earning,
               remarks,
               buddy_name,
               buddy_relation,
               buddy_address,
               buddy_city,
               buddy_phone,
               buddy1_name,
               buddy1_relation,
               buddy1_address,
               buddy1_city,
               buddy1_phone,
               admit_name,
               admit_relation,
               admit_address,
               admit_phone,
               admit_age,
               admit_gender,
               isActive: is_Active,

               ip_addr,
               user_id,
            },
            {where: {id}}
         );
         //   console.log('updatedPatient', updatedPatient);
         if (updatedPatient) {
            req.flash('success_msg', 'Data Successfully updated.');
         }
         return res.redirect('/patient_docs/register');
      }
   } catch (err) {
      logger.error(err);
   }
   return null;
};

// edit

const editPatient = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Patient.findByPk(id);
      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/patient/registerTable');
      }
      const img = rows.image_data;
      const patientTypes = await getPatientTypes();
      const religions = await getReligions();
      const languages = await getLanguages();

      res.render('patientPages/registerPatient', {
         rows,
         img,
         patientTypes,
         languages,
         religions,
         selectedPatientType: rows.patient_type_id,
         selectedReligion: rows.religion,
         selectedLanguage: rows.language,
         selectedGender: rows.gender,
         selectedAGender: rows.admit_gender,
      });
   } catch (error) {
      return error.message;
   }
   return null;
};

async function getPatientTypes() {
   try {
      const rows = await db.query(`SELECT * FROM patient_type`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch patient_type from database", error);
      }
      return null;
   }
}

async function getReligions() {
   try {
      const rows = await db.query(`SELECT * FROM religions`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch religions from database", error);
      }
      return null;
   }
}
async function getLanguages() {
   try {
      const rows = await db.query(`SELECT * FROM languages`, {
         type: QueryTypes.SELECT,
      });
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch languages from database", error);
      }
      return null;
   }
}

async function getregisterPatientTable() {
   try {
      const rows = await db.query(`SELECT * FROM patient_data `, {
         type: QueryTypes.SELECT,
      });
      // console.log('rows = >', rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch Registered patients from database", error);
      }
      return null;
   }
}

async function deletePatient(req, res) {
   const {id} = req.params;
   try {
      await Patient.destroy({
         where: {
            id,
         },
      });

      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/patient/registerTable');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/patient/registerTable');
         }
         logger.error("Can't delete User Roles from database ->", error);
      }
      return null;
   }
}

module.exports = {
   savePatient,
   editPatient,
   updatePatient,
   deletePatientTable,
   patientRegister,
   patientTable,
};
