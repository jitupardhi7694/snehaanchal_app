const {QueryTypes} = require('sequelize');
const logger = require('../helpers/winston');
const db = require('../helpers/init-mysql');

const patientDocs = require('../models/patientDocModel');

// Patients Registration Form Page

const patientDocRegister = async (req, res) => {
   const patientData = await getPatientData();
   const rows = await patientDocs.findAll();
   res.render('patientPages/patientDoc', {
      rows,
      patientData,
      selectedPatientData: null,
      img: null,
   });
};

const patientDocTable = async (req, res) => {
   const patientDocsTable = await getPatientDocTable(); // search for the patient data

   res.render('patientPages/patientDocTable', {
      patientDocsTable,
   });
   return null;
};

const deletePatientDocTable = async (req, res) => {
   await deletePatientDocs(req, res);
};

// // // save
// const savePatientDocs = async (req, res) => {
//    const user_id = req.user.id;
//    const ip_addr =
//       req.headers['x-forwarded-for'] ||
//       req.remoteAddress ||
//       req.socket.remoteAddress ||
//       (req.socket ? req.socket.remoteAddress : null);
//    const {patientID, docName, id} = req.body;
//    try {
//       const rows = await patientDocs.findAll();
//       const patientData = await getPatientData();
//       const imageData = await patientDocs.findByPk(id);

//       const errors = req.ValidateErrors;
//       const {docname, filedata} = req.file || {}; // add this line to handle case when req.file is null or undefined
//       if (errors.length > 0) {
//          // return to form with errors
//          return res.render('patientPages/patientDoc', {
//             errors,
//             rows,
//             patientData,
//             selectedPatientData: req.body.patientID,
//             img: imageData ? imageData.doc_data : null,

//          });
//       }
//       // create new patient
//       const newPatientDocs = await patientDocs.create({
//          patientID,
//          docName,
//          docImage: docname || '', // provide a default value if docname is falsy
//          doc_data: filedata || '', // provide a default value if filedata is falsy
//          ip_addr,
//          user_id,
//       });
//       console.log('newPatient', newPatientDocs);
//       req.flash('success_msg', `Patient ${newPatientDocs.docName} is saved.`);
//       return res.redirect('/patient_docs/register');
//    } catch (error) {
//       console.log(error);
//    }
//    return null;
// };

const savePatientDocs = async (req, res) => {
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);
   const {patientID, docName, id} = req.body;
   try {
      const rows = await patientDocs.findAll();
      const patientData = await getPatientData();
      const imageData = await patientDocs.findByPk(id);
      const {originalname, filename} = req.file;
      const errors = req.validationErrors;
      if (errors) {
         return res.render('patientPages/patientDoc', {
            errors,
            rows,
            patientData,
            selectedPatientData: req.body.patientID,
            img: imageData.doc_data,
         });
      }

      const newPatientDocs = await patientDocs.create({
         patientID,
         docName,
         docImage: originalname,
         doc_data: filename,
         ip_addr,
         user_id,
      });
      console.log('newPatient', newPatientDocs);
      req.flash('success_msg', `Patient ${newPatientDocs.docName} is saved.`);
      return res.redirect('/dashboard');
   } catch (error) {
      console.log(error);
   }
   return null;
};

// update

const updatedPatientDoc = async (req, res) => {
   const {id} = req.params;
   const user_id = req.user.id;
   const ip_addr =
      req.headers['x-forwarded-for'] ||
      req.remoteAddress ||
      req.socket.remoteAddress ||
      (req.socket ? req.socket.remoteAddress : null);

   const {patientID, docName} = req.body;

   const imageData = await patientDocs.findByPk(id);
   const patientData = await getPatientData();
   const {originalname, filename} = req.file;

   const errors = req.ValidateErrors;
   if (errors.length > 0) {
      // return to form with errors
      return res.render('patientPages/patientDoc', {
         errors,
         patientData,
         rows: req.body,
         selectedPatientData: req.body.patientID,
         img: imageData.doc_data,
      });
   }

   try {
      if (id !== '') {
         const updatedPatientDoc = await patientDocs.update(
            {
               patientID,
               docName,
               docImage: originalname,
               doc_data: filename,
               ip_addr,
               user_id,
            },
            {where: {id}}
         );
         //   console.log('updatedPatient', updatedPatient);
         if (updatedPatientDoc) {
            req.flash('success_msg', 'Data Successfully updated.');
         }
         return res.redirect('/patient_docs/patientDocTable');
      }
   } catch (err) {
      logger.error(err);
   }
   return null;
};

// edit

const editPatientDoc = async (req, res) => {
   const {id} = req.params;
   try {
      const rows = await patientDocs.findByPk(id);

      if (rows === null) {
         //  console.log('inside blank');
         req.flash('error_msg', `No record found for editing`);
         return res.redirect('/patient_docs/patientDocTable');
      }
      const img = rows.doc_data;
      const patientData = await getPatientData();

      res.render('patientPages/patientDoc', {
         rows,
         img,
         patientData,
         selectedPatientData: rows.patientID,
      });
   } catch (error) {
      return error.message;
   }
   return null;
};

async function getPatientData() {
   try {
      const rows = await db.query(`SELECT * FROM patients`, {
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
async function getPatientDocTable() {
   try {
      const rows = await db.query(`SELECT * FROM patient_doc_data`, {
         type: QueryTypes.SELECT,
      });
      // console.log(rows);
      return rows;
   } catch (error) {
      if (error) {
         logger.error("Can't fetch patient docs from database", error);
      }
      return null;
   }
}

async function deletePatientDocs(req, res) {
   const {id} = req.params;
   try {
      await patientDocs.destroy({
         where: {
            id,
         },
      });

      req.flash('success_msg', 'Data Deleted successfully.');
      return res.redirect('/patient_docs/patientDocTable');
   } catch (error) {
      if (error) {
         if (error.message.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
            req.flash('error_msg', 'Cannot delete this record as it is already in use.');
            return res.redirect('/patient_docs/patientDocTable');
         }
         logger.error("Can't delete Patients Documents from database ->", error);
      }
      return null;
   }
}

module.exports = {
   savePatientDocs,
   editPatientDoc,
   updatedPatientDoc,
   deletePatientDocTable,
   patientDocRegister,
   patientDocTable,
};
