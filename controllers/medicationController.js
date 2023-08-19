const moment = require('moment');
const {Op} = require('sequelize');

const Medication = require('../models/medicationModel');
const logger = require('../helpers/winston');
// limit access to routes in this filename

// register

const medicationRegister = async (req, res) => {
   const rows = await fetchMedications();

   res.render('masterPages/medication', {rows});
};

// medication table

const medicationTable = async (req, res) => {
   const medicationReport = await fetchMedications();

   res.render('masterPages/medicationTable', {medicationReport, moment});
   // console.log('data on server');
};
// delete

const deleteMedicationData = async (req, res) => {
   await deleteMedication(req, res);
};

// save data

const saveMedication = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const is_Active = req.body.is_Active ? 1 : 0;

   const {medication_name, dosage, frequency, start_date, end_date, id, rows} = req.body;

   try {
      const errors = req.ValidateErrors || [];
      if (errors.length > 0) {
         // return to form with errors
         return res.render('masterPages/medication', {
            errors,
            rows,
         });
      }

      const medication = await Medication.findOne({
         where: {medication_name, id: {[Op.ne]: id}},
      });

      if (medication) {
         // Already Exists, return back to form
         errors.push({msg: 'This medicine  is already saved'});
         return res.render('masterPages/medication', {
            errors,
            id,
            rows,
         });
      }
      // create new patient
      const newMedication = await Medication.create({
         medication_name,
         dosage,
         frequency,
         start_date,
         end_date,
         ip_addr,
         user_id,
         isActive: is_Active,
      });

      req.flash('success_msg', `Medication ${newMedication.medication_name} is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      return error;
   }
};

// edit

const editMedication = async (req, res) => {
   const {id} = req.params;

   try {
      const rows = await Medication.findByPk(id);

      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/medication/registerTable');
      }

      res.render('masterPages/medication', {
         rows,
      });
   } catch (error) {
      return error;
   }
   return null;
};

// update

const updateMedication = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const {id} = req.params;

   const is_Active = req.body.is_Active ? 1 : 0;

   const {medication_name, dosage, frequency, start_date, end_date} = req.body;

   try {
      const errors = req.ValidateErrors || [];
      if (errors.length > 0) {
         // return to form with errors
         return res.render('masterPages/medication', {
            errors,
            rows: req.body,
         });
      }

      // check for duplicate religion name before inserting/updating

      const medication = await Medication.findOne({
         where: {medication_name, id: {[Op.ne]: id}},
      });

      if (medication) {
         // Already Exists, return back to form
         errors.push({msg: 'This Medication is already saved'});
         return res.render('masterPages/medication', {
            errors,
            id,
            rows: req.body,
         });
      }

      if (id !== '') {
         const updatedMedication = await Medication.update(
            {
               medication_name,
               dosage,
               frequency,
               start_date,
               end_date,
               ip_addr,
               user_id,
               isActive: is_Active,
            },
            {where: {id}}
         );
         //   console.log('updatedPatient', updatedPatient);
         if (updatedMedication) {
            req.flash('success_msg', ` Data Successfully updated.`);
         }
         return res.redirect('/medication/registerTable');
      }
   } catch (err) {
      logger.error(err);
   }
   return null;
};

async function fetchMedications() {
   try {
      const medication = await Medication.findAll();
      return medication;
   } catch (error) {
      logger.error("Can't fetch Medication from database", error);
      return null;
   }
}

async function deleteMedication(req, res) {
   const {id} = req.params;
   try {
      const rows = await Medication.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/medication/registerTable');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/medication/registerTable');
         }
         logger.error("Can't delete User Roles from database ->", error);
      }
      return null;
   }
}

module.exports = {
   medicationRegister,
   medicationTable,
   deleteMedicationData,
   saveMedication,
   editMedication,
   updateMedication,
};
