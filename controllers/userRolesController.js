const {Op} = require('sequelize');
const UserRoles = require('../models/roles');
const logger = require('../helpers/winston');

// roles Add Form Page
const getUserRole = async (req, res) => {
   const userData = await getRoles();

   return res.render('masterPages/user_roles', {userData});
};

const postUserRole = async (req, res, next) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   // Check for errors in submitted data
   const {roleName, is_Active, id} = req.body;
   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      const userData = await getRoles();
      return res.render('masterPages/user_roles', {
         errors,
         roleName,
         id,
         userData,

         is_Active,
      });
   }
   // check for duplicate roles name before inserting/updating
   const UserRole = await UserRoles.findOne({
      where: {role_name: roleName, id: {[Op.ne]: id}},
   });

   if (UserRole) {
      // Already Exists, return back to form
      errors.push({msg: 'This User Roles is already saved'});
      const userData = await getRoles();
      return res.render('masterPages/user_roles', {
         errors,
         roleName,
         id,
         userData,
      });
   }
   //   data validated now check if insert or update is needed.
   try {
      const is_Active1 = req.body.is_Active ? 1 : 0;

      if (id !== '') {
         // id is not blank, run update query
         const updatedRecord = await UserRoles.update(
            {role_name: roleName, isActive: is_Active1, ip_addr, user_id},
            {where: {id}}
         );

         if (updatedRecord) {
            req.flash('success_msg', 'Data Successfully updated.');
            return res.redirect('/user_roles');
         }
      }

      // its new record creation time.
      const createRecord = await UserRoles.create({
         role_name: roleName,
         isActive: is_Active1,

         ip_addr,
         user_id,
      });
      if (createRecord) {
         req.flash('success_msg', 'Data Sucessfully saved.');
      }
      return res.redirect('/user_roles');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
   // delete roles query
};

const deleteRoles = async (req, res) => {
   const {id} = req.params;
   try {
      await UserRoles.destroy({
         where: {
            id,
         },
      });

      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/user_roles');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/user_roles');
         }
         logger.error("Can't delete User Roles from database ->", error);
      }
      return null;
   }
};

async function getRoles() {
   try {
      const User_Roles = await UserRoles.findAll();
      return User_Roles;
   } catch (error) {
      logger.error("Can't fetch User Roles from database", error);
      return null;
   }
}

module.exports = {getUserRole, postUserRole, deleteRoles};
