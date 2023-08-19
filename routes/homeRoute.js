const express = require('express');

const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth-helper');
const dashboardController = require('../controllers/dashboardController');
const roles = require('../config/roles.json');

// app Landing page
router.get(['/', '/dashboard'], ensureAuthenticated, async (req, res, next) => {
   if ([roles.ADMIN, roles.OWNER].includes(req.user.role_id)) {
      return dashboardController.adminDashboard(req, res, next);
   }
   if ([roles.COUNSELLOR].includes(req.user.role_id)) {
      return dashboardController.counsellerDashboard(req, res, next);
   }
   if ([roles.DOCTOR].includes(req.user.role_id)) {
      return dashboardController.doctorDashboard(req, res, next);
   }
   if ([roles.NURSE].includes(req.user.role_id)) {
      return dashboardController.nurseDashboard(req, res, next);
   }
   return res.send('No dashboard available, please check with the developers.').status(404);
});

module.exports = router;
