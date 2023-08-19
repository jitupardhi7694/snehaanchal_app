const {QueryTypes} = require('sequelize');

const moment = require('moment');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');

const Symptoms = require('../models/symptomModel');

const symptomRegister = async (req, res) => {
   const patientTypes = await getPatientTypes();

   res.render('transaction/symptoms', {
      rows: null,
      patientTypes,
      selectedPatientType: null,
      moment,
   });
};

const symptomTable = async (req, res) => {
   const registersymptomsTable = await getsymptomsTable();

   res.render('transaction/symptomsReport', {
      registersymptomsTable,
      moment,
   });
};
// save

const symptomsSave = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, symptom_name, severity, date_reported} = req.body;

   try {
      const rows = req.body;

      const {id} = req.body;
      const errors = req.ValidateErrors;
      if (errors.length > 0) {
         return res.render('transaction/symptoms', {
            errors,
            patient_id,
            symptom_name,
            severity,
            date_reported,
         });
      }
      const patientTypes = await getPatientTypes();

      const symptoms = await checkduplicate(patient_id, symptom_name, date_reported);
      if (symptoms > 0) {
         // Already Exists, return back to form
         errors.push({msg: 'This Symptoms is already saved'});
         return res.render('transaction/symptoms', {
            patientTypes,
            errors,
            id,
            rows,
            selectedPatientType: rows.patient_id,
            symptoms,
         });
      }
      // create new patient
      const newSymptoms = await Symptoms.create({
         patient_id,
         symptom_name,
         severity,
         date_reported,
         ip_addr,
         user_id,
      });

      req.flash('success_msg', `Symptoms  ${newSymptoms.symptom_name}  is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// update

const updateSymptoms = async (req, res) => {
   const {id} = req.params;
   const rows = req.body;
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patient_id, symptom_name, severity, date_reported} = req.body;
   const patientTypes = await getPatientTypes();
   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      return res.render('transaction/symptoms', {
         errors,
         id,
         rows,
         patientTypes,
         selectedPatientType: rows.patient_id,
      });
   }

   const symptoms = await checkduplicate(patient_id, symptom_name, date_reported);
   // check for duplicate religion name before inserting/updating
   if (symptoms > 0) {
      // Already Exists, return back to form
      errors.push({msg: 'This symptoms is already saved'});
      return res.render('transaction/symptoms', {
         errors,
         id,
         rows,
         patientTypes,
         selectedPatientType: rows.patient_id,
         symptoms,
      });
   }

   try {
      if (id !== '') {
         const updatedSymptoms = await Symptoms.update(
            {
               patient_id,
               symptom_name,
               severity,
               date_reported,
               ip_addr,
               user_id,
            },
            {where: {id}}
         );

         if (updatedSymptoms) {
            req.flash('success_msg', 'Data Successfully updated.');
         }
         return res.redirect('/symptoms/symptomsReport');
      }
   } catch (err) {
      logger.error(err);
   }
   return null;
};

// edit

const symptomsEdit = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Symptoms.findOne({where: {id}});

      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/symptoms/symptomsReport');
      }

      const patientTypes = await getPatientTypes();

      res.render('transaction/symptoms', {
         id,
         rows,
         patientTypes,
         selectedPatientType: rows.patient_id,
         moment,
      });
   } catch (error) {
      return error;
   }
   return null;
};

const symptomsDelete = async (req, res) => {
   await deletesymptomss(req, res);
};

async function getPatientTypes() {
   try {
      const rows = await db.query(`SELECT * FROM patients`, {
         type: QueryTypes.SELECT,
      });

      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch patient from database", error);
      }
      return null;
   }
}

async function deletesymptomss(req, res) {
   const {id} = req.params;
   try {
      const rows = await Symptoms.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/symptoms/symptomsReport');
   } catch (error) {
      if (error) {
         console.log('error =>', error);
         logger.error("Can't delete Symptoms from database", error);
      }
      return null;
   }
}

async function getsymptomsTable() {
   try {
      const rows = await db.query(`Select * from symptoms_data `, {
         type: QueryTypes.SELECT,
      });

      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch Registered symptoms from database", error);
      }
      return null;
   }
}

async function checkduplicate(patient_id, symptom_name, date_reported) {
   try {
      const rows = await db.query(
         `SELECT COUNT(*) AS count_overlap 
         FROM symptoms 
         WHERE patient_id = :patient_id  
           AND symptom_name = :symptom_name
          AND date_reported >= :date_reported`,
         {
            type: QueryTypes.SELECT,
            replacements: {
               patient_id,
               symptom_name,
               date_reported,
            },
         }
      );
      return rows[0].count_overlap;
   } catch (error) {
      logger.error("Can't fetch symptoms from database", error);
      return null;
   }
}
module.exports = {symptomRegister, symptomTable, symptomsEdit, symptomsSave, symptomsDelete, updateSymptoms};
