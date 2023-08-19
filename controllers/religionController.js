const {Op} = require('sequelize');
const Religion = require('../models/religionModel');
const logger = require('../helpers/winston');
// Religion Add Form Page
const getReligion = async (req, res) => {
   const userData = await fetchReligions();

   res.render('masterPages/religion', {userData});
};

const postReligion = async (req, res, next) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   // Check for errors in submitted data
   const {religionName, is_Active, id} = req.body;

   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      const userData = await fetchReligions();
      return res.render('masterPages/religion', {
         errors,
         religionName,
         id,
         userData,
         is_Active,
      });
   }
   // check for duplicate religion name before inserting/updating
   const religion = await Religion.findOne({
      where: {religion: religionName, id: {[Op.ne]: id}},
   });
   if (religion) {
      // Already Exists, return back to form
      errors.push({msg: 'This religion is already saved'});
      const userData = await fetchReligions();
      return res.render('masterPages/religion', {
         errors,
         religionName,
         id,
         userData,
         is_Active,
      });
   }

   try {
      const is_Active1 = req.body.is_Active ? 1 : 0;

      if (id !== '') {
         // id is not blank, run update query

         const updatedRecord = await Religion.update(
            {religion: religionName, isActive: is_Active1, ip_addr, user_id},
            {where: {id}}
         );
         // console.log(updatedRecord);
         if (updatedRecord) {
            req.flash('success_msg', 'Data Successfully updated.');
         }
         return res.redirect('/religion');
      }

      // its new record creation time.
      const newRecord = await Religion.create({
         religion: religionName,
         isActive: is_Active1,
         ip_addr,
         user_id,
      });
      if (newRecord) {
         req.flash('success_msg', 'Data Successfully saved.');
      }
      return res.redirect('/religion');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
};

// const deleteReligion = async (req, res) => {

//    const {id} = req.params;
//    try {
//       const rows = await Religion.destroy({where: {id}});
//       logger.warn('Deleted:', rows);
//       req.flash('success_msg', 'Data Deleted successfully.');
//       return res.redirect('/religion');
//    } catch (error) {
//       if (error) logger.error("Can't delete religion from database", error);
//       return null;
//    }
// };

const deleteReligion = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await Religion.destroy({where: {id}});
      logger.warn('Deleted:', rows);
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/religion');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/religion');
         }
         logger.error("Can't delete religion from database", error);
         return res.status(500).send('Internal Server Error');
      }
   }
   return null;
};

async function fetchReligions() {
   try {
      const religion = await Religion.findAll();
      return religion;
   } catch (error) {
      logger.error("Can't fetch religion from database", error);
      return null;
   }
}

module.exports = {getReligion, postReligion, deleteReligion};
