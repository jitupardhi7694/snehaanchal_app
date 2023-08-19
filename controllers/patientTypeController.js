const {Op} = require('sequelize');
const PatientType = require('../models/patientTypeModel');
const logger = require('../helpers/winston');

// roles Add Form Page
const getPatientType = async (req, res) => {
   const userData = await getPatientTypes();

   return res.render('masterPages/patient_type', {userData});
};

const postPatientType = async (req, res, next) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   // Check for errors in submitted data
   const {typeCode, is_Active, id} = req.body;
   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      const userData = await getPatientTypes();

      return res.render('masterPages/patient_type', {
         errors,
         typeCode,
         id,
         userData,
         is_Active,
      });
   }
   // check for duplicate roles name before inserting/updating
   const patientType = await PatientType.findOne({
      where: {type_code: typeCode, id: {[Op.ne]: id}},
   });

   if (patientType) {
      // Already Exists, return back to form
      errors.push({msg: 'This Patient Type is already saved'});
      const userData = await getPatientTypes();
      // console.log('userData=>', userData);
      return res.render('masterPages/patient_type', {
         errors,
         typeCode,
         id,
         userData,
      });
   }
   //   data validated now check if insert or update is needed.
   try {
      const is_Active1 = req.body.is_Active ? 1 : 0;

      if (id !== '') {
         // id is not blank, run update query
         const updatedRecord = await PatientType.update(
            {type_code: typeCode, isActive: is_Active1, ip_addr, user_id},
            {where: {id}}
         );
         // console.log('updatedRecord => ', updatedRecord);
         if (updatedRecord) {
            req.flash('success_msg', 'Data Successfully updated.');
            return res.redirect('/patient_type');
         }
      }

      // its new record creation time.
      const newRecord = await PatientType.create({
         type_code: typeCode,
         isActive: is_Active1,

         ip_addr,
         user_id,
      });
      if (newRecord) {
         req.flash('success_msg', 'Data Sucessfully saved.');
      }
      return res.redirect('/patient_type');
   } catch (error) {
      console.log('error =>', error);

      logger.error(error);
      return next(error);
   }
   // delete roles query
};

const deletePatientType = async (req, res) => {
   const {id} = req.params;
   try {
      await PatientType.destroy({
         where: {
            id,
         },
      });
      // console.log('rows', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/patient_type');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/patient_type');
         }
         logger.error("Can't delete Patient Type from database", error);
      }
      return null;
   }
};

async function getPatientTypes() {
   try {
      const Patient_Type = await PatientType.findAll();
      return Patient_Type;
   } catch (error) {
      logger.error("Can't fetch Patient Type from database", error);
      return null;
   }
}

module.exports = {getPatientType, postPatientType, deletePatientType};
