const {Op} = require('sequelize');
const moment = require('moment');
// const {QueryTypes} = require('sequelize');
const Patient = require('../models/patientModel');
const Counseller = require('../models/counsellerModel');
const Medication = require('../models/medicationModel');
const Prescriptions = require('../models/prescriptionsModel');
const Symptoms = require('../models/symptomModel');
const Staff = require('../models/staffModel');
const Visits = require('../models/visitModel');
const logger = require('../helpers/winston');
const language = require('../models/languageModel');
const religion = require('../models/religionModel');
const userRoles = require('../models/roles');
const patientType = require('../models/patientTypeModel');
const nurse = require('../models/nurseModel');
const patientDocs = require('../models/patientDocModel');
const doctorPrescriptions = require('../models/doctorPrescriptionModel');

// const db = require('../helpers/init-mysql');

const adminDashboard = async (req, res) => {
   const data = await getAdminDashboardData();

   const counsellerTotal = await getCounsellorDashboardData();
   const {name} = req.user;
   const totalMedicine = await getMedicationData();
   const staffDashData = await getStaffDashboardData();
   const Patientsgenderdata = await fetchPatientsGenderdata();
   const Patientsreligiondata = await fetchPatientsReligiondata();
   const monthlypatientCounts = await fetchPatientslastssmdata();
   const languageData = await getLanguage();
   const religionData = await getReligion();
   const userRolesData = await getUseRoles();
   const patientTypeData = await getPatientType();
   const nurseData = await getNurse();
   const prescriptionData = await getPrescriptionsData();
   const symptoms = await getSymptomsData();
   const visitData = await getVisit();
   const PatientDocs = await getPatientDocs();
   const DocPrescriptions = await getDoctorPrescriptions();
   return res.render('dashboard/adminDashboard', {
      data,
      totalMedicine,
      staffDashData,
      name,
      prescriptionData,
      visitData,
      symptoms,
      languageData,
      religionData,
      DocPrescriptions,
      userRolesData,
      patientTypeData,
      nurseData,
      counsellerTotal,
      Patientsgenderdata,
      Patientsreligiondata,
      monthlypatientCounts,
      PatientDocs,
      isDashboard: true,
   });
};

const counsellerDashboard = async (req, res) => {
   const data = await getCounsellorDashboardData();
   const visitData = await getVisit();
   const monthlycounsellerCounts = await fetchCounsellerlastssmdata();

   const {name} = req.user;

   return res.render('dashboard/counsellorDashboard', {
      data,
      name,
      visitData,
      monthlycounsellerCounts,
      isCounseller: true,

      isDashboard: false,
      isTransaction: true,
   });
};

const doctorDashboard = async (req, res) => {
   const data = await getPrescriptionsData();
   const symptoms = await getSymptomsData();

   const {name} = req.user;

   return res.render('dashboard/doctorDashboard', {
      data,
      name,
      symptoms,
      isDoctor: true,
      isCounseller: false,

      isDashboard: false,
      isTransaction: true,
   });
};

const nurseDashboard = async (req, res) => {
   const data = await getSymptomsData();

   const {name} = req.user;

   return res.render('dashboard/nurseDashboard', {
      data,
      name,

      isNurse: true,
      isDoctor: false,
      isCounseller: false,

      isDashboard: false,
      isTransaction: true,
   });
};

async function getAdminDashboardData() {
   const data = {};
   data.totalPatients = await Patient.count();
   return data.totalPatients;
}

async function getStaffDashboardData() {
   const data = {};
   data.totalStaffs = await Staff.count();
   return data.totalStaffs;
}

async function getCounsellorDashboardData() {
   const data = {};
   data.totalcounseller = await Counseller.count();
   return data.totalcounseller;
}

async function getMedicationData() {
   const data = {};
   data.totalmedicine = await Medication.count();

   return data.totalmedicine;
}

async function getPatientDocs() {
   const data = {};
   data.totalpatientDoc = await patientDocs.count();

   return data.totalpatientDoc;
}

async function getPrescriptionsData() {
   const data = {};
   data.totalprescriptions = await Prescriptions.count();

   return data.totalprescriptions;
}

async function getDoctorPrescriptions() {
   const data = {};
   data.totalprescriptions = await doctorPrescriptions.count();

   return data.totalprescriptions;
}

async function getVisit() {
   const data = {};
   data.totalVisit = await Visits.count();

   return data.totalVisit;
}

async function getSymptomsData() {
   const data = {};
   data.totalSymptoms = await Symptoms.count();

   return data.totalSymptoms;
}

async function getLanguage() {
   const data = {};
   data.totalSymptoms = await language.count();

   return data.totalSymptoms;
}

async function getReligion() {
   const data = {};
   data.totalSymptoms = await religion.count();

   return data.totalSymptoms;
}

async function getUseRoles() {
   const data = {};
   data.totalSymptoms = await userRoles.count();

   return data.totalSymptoms;
}

async function getPatientType() {
   const data = {};
   data.totalSymptoms = await patientType.count();

   return data.totalSymptoms;
}

async function getNurse() {
   const data = {};
   data.totalSymptoms = await nurse.count();

   return data.totalSymptoms;
}

async function fetchPatientsGenderdata() {
   try {
      const malePatients = await Patient.count({
         where: {
            gender: 'male',
         },
      });

      const femalePatients = await Patient.count({
         where: {
            gender: 'female',
         },
      });
      return [malePatients, femalePatients];
   } catch (error) {
      if (error) logger.error("Can't fetch patients gender from database", error);
      return null;
   }
}

async function fetchPatientsReligiondata() {
   try {
      const marathaPatients = await Patient.count({
         where: {
            religion: '142',
         },
      });

      const hinduPatients = await Patient.count({
         where: {
            religion: '143',
         },
      });

      const muslimPatients = await Patient.count({
         where: {
            religion: '149',
         },
      });
      const sikhPatients = await Patient.count({
         where: {
            religion: '150',
         },
      });
      const christiansPatients = await Patient.count({
         where: {
            religion: '151',
         },
      });

      return [marathaPatients, hinduPatients, muslimPatients, sikhPatients, christiansPatients];
   } catch (error) {
      if (error) logger.error("Can't fetch patients religion from database", error);
      return null;
   }
}

async function fetchPatientslastssmdata() {
   try {
      const startDate = moment().subtract(6, 'months').startOf('month'); // start from the beginning of the month

      const monthlypatientCounts = [];

      for (let i = 1; i < 7; i++) {
         const startOfMonth = startDate.clone().add(i, 'months');
         const endOfMonth = startOfMonth.clone().endOf('month');

         const count = await Patient.count({
            where: {
               created_at: {[Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()]},
            },
         });

         monthlypatientCounts.push(count);
      }

      return monthlypatientCounts;
   } catch (error) {
      console.error("Can't fetch registered patients from database", error);
      return null;
   }
}

async function fetchCounsellerlastssmdata() {
   try {
      const startDate = moment().subtract(6, 'months').startOf('month'); // start from the beginning of the month

      const monthlycounsellerCounts = [];

      for (let i = 1; i < 7; i++) {
         const startOfMonth = startDate.clone().add(i, 'months');
         const endOfMonth = startOfMonth.clone().endOf('month');

         const count = await Counseller.count({
            where: {
               created_at: {[Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()]},
            },
         });

         monthlycounsellerCounts.push(count);
      }

      return monthlycounsellerCounts;
   } catch (error) {
      console.error("Can't fetch registered counselors from database", error);
      return null;
   }
}

module.exports = {adminDashboard, counsellerDashboard, doctorDashboard, nurseDashboard};
