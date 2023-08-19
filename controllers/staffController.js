const moment = require('moment');
const {Op} = require('sequelize');
const Staff = require('../models/staffModel');
const logger = require('../helpers/winston');

// register staff

const staffRegister = async (req, res) => {
   const rows = await fetchStaffs();
   res.render('masterPages/staff', {rows});
};

// sataff report router
const staffTable = async (req, res) => {
   const staffReport = await fetchStaffs();

   res.render('masterPages/staffReportData', {staffReport, moment});
   // console.log('data on server');
};

// staff report delete router
const staffDeleteData = async (req, res) => {
   await deleteStaff(req, res);
};

// save staff data

const staffSave = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const is_Active = req.body.is_Active ? 1 : 0;

   const {
      first_name,
      last_name,
      date_of_birth,
      address,
      city,
      state,
      zip_code,
      phone_number,
      position,
      hire_date,
      id,
      rows,
   } = req.body;

   try {
      const errors = req.ValidateErrors || [];
      if (errors.length > 0) {
         // return to form with errors
         return res.render('masterPages/staff', {
            errors,
            rows,
         });
      }
      // check for duplicate religion name before inserting/updating
      const staff = await Staff.findOne({
         where: {first_name, id: {[Op.ne]: id}},
      });
      if (staff) {
         // Already Exists, return back to form
         errors.push({msg: 'This staff is already saved'});
         // const staffReport = await fetchStaffs();

         return res.render('masterPages/staff', {
            errors,
            id,
            rows,
         });
      }

      // create new patient
      const newStaff = await Staff.create({
         first_name,
         last_name,
         date_of_birth,
         address,
         city,
         state,
         zip_code,
         phone_number,
         position,
         hire_date,
         isActive: is_Active,
         ip_addr,
         user_id,
      });

      req.flash('success_msg', `Staff ${newStaff.first_name}   ${newStaff.last_name} is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// edit staff data

const staffEdit = async (req, res) => {
   const {id} = req.params;

   try {
      const rows = await Staff.findOne({where: {id}});

      if (rows === null) {
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/staff/registerTable');
      }

      res.render('masterPages/staff', {
         rows,
      });
   } catch (error) {
      return error;
   }
   return null;
};

// update staff data

// update
const staffUpdate = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const is_Active = req.body.is_Active ? 1 : 0;

   const {id} = req.params;

   const {first_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, position, hire_date} =
      req.body;
   try {
      const errors = req.ValidateErrors || [];
      if (errors.length > 0) {
         // return to form with errors
         return res.render('masterPages/staff', {
            id,
            errors,
            rows: req.body,
         });
      }

      // check for duplicate religion name before inserting/updating
      const staff = await Staff.findOne({
         where: {first_name, id: {[Op.ne]: id}},
      });

      if (staff) {
         // Already Exists, return back to form
         errors.push({msg: 'This staff is already saved'});

         return res.render('masterPages/staff', {
            errors,
            id,
            rows: req.body,
         });
      }

      if (id !== '') {
         const updatedStaff = await Staff.update(
            {
               first_name,
               last_name,
               date_of_birth,
               address,
               city,
               state,
               zip_code,
               phone_number,
               position,
               hire_date,
               ip_addr,
               user_id,
               isActive: is_Active,
            },
            {where: {id}}
         );
         //   console.log('updatedPatient', updatedPatient);
         if (updatedStaff) {
            req.flash('success_msg', ` Data Successfully updated.`);
         }
         return res.redirect('/staff/registerTable');
      }
   } catch (err) {
      logger.error(err);
   }
   return null;
};

async function fetchStaffs() {
   try {
      const staff = await Staff.findAll();
      return staff;
   } catch (error) {
      logger.error("Can't fetch staff from database", error);
      return null;
   }
}

async function deleteStaff(req, res) {
   const {id} = req.params;
   try {
      const rows = await Staff.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/staff/registerTable');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/staff/registerTable');
         }
         logger.error("Can't delete User Roles from database ->", error);
      }
      return null;
   }
}

module.exports = {staffRegister, staffTable, staffEdit, staffDeleteData, staffSave, staffUpdate};
