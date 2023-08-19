const {Op} = require('sequelize');

const Language = require('../models/languageModel');
const logger = require('../helpers/winston');

// Language Add Form Page
const getLanguage = async (req, res) => {
   const userData = await fetchLanguages();

   res.render('masterPages/language', {userData});
};

const postLanguage = async (req, res, next) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   // Check for errors in submitted data
   const {languages, is_Active, id} = req.body;
   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      const userData = await fetchLanguages();
      return res.render('masterPages/language', {
         errors,
         languages,
         id,
         userData,
         is_Active,
      });
   }
   // check for duplicate Language name before inserting/updating
   const language = await Language.findOne({
      where: {language: languages, id: {[Op.ne]: id}},
   });
   if (language) {
      // Already Exists, return back to form
      errors.push({msg: 'This Language is already saved'});
      const userData = await fetchLanguages();
      return res.render('masterPages/language', {
         errors,
         languages,
         id,
         userData,
         is_Active,
      });
   }
   //   data validated now check if insert or update is needed.
   try {
      const isActive = req.body.is_Active ? 1 : 0;
      if (id !== '') {
         // id is not blank, run update query
         const updateLanguage = await Language.update({language: languages, isActive, ip_addr, user_id}, {where: {id}});
         if (updateLanguage) {
            req.flash('success_msg', 'Data Successfully updated.');
            return res.redirect('/language');
         }
      }
      // its new record creation time.

      const newRecord = await Language.create({
         language: languages,
         isActive,
         ip_addr,
         user_id,
      });
      if (newRecord) {
         req.flash('success_msg', 'Data Successfully saved.');
      }
      return res.redirect('/language');
   } catch (error) {
      logger.error(error);
      return next(error);
   }
};

const deleteLanguages = async (req, res) => {
   const {id} = req.params;
   try {
      await Language.destroy({where: {id}});
      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/language');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/language');
         }
         logger.error("Can't delete religion from database", error);
      }
   }
   return null;
};

async function fetchLanguages() {
   try {
      return Language.findAll();
   } catch (error) {
      logger.error("Can't fetch languages from database", error);
      return null;
   }
}

module.exports = {getLanguage, postLanguage, deleteLanguages};
