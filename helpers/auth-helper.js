const roles = require('../config/roles.json');
const menuByRoles = require('../config/roles_menu.json');

function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
      // console.log(req.user);
      return next();
   }
   req.flash('error_msg', 'Please log in to view this resource');
   return res.redirect('/users/login');
}

function ensureNotAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
      req.flash('success_msg', 'Already logged In, Please logout first to login again');
      return res.redirect('/dashboard');
   }
   return next();
}

function ensureAdmin(req, res, next) {
   if (req.isAuthenticated() && req.user.role_id === roles.ADMIN) {
      return next();
   }
   req.flash('error_msg', 'Not Authorized!, You do not have the rights to access this resource.');
   return res.redirect('/dashboard');
}

function checkRoles(rolesArr) {
   return (req, res, next) => {
      if (req.isAuthenticated()) {
         // If the user is authenticated, check if they have any of the required roles
         if (rolesArr.includes(req.user.role_id)) return next();
         // not authorized user
         req.flash('error', 'You do not have the necessary authorization to access this page.');
         return res.redirect('back');
      }
      // If the user is not authenticated, redirect them to the login page
      return res.redirect('/users/login');
   };
}

// preventMultipleLogins Middleware
const userSessions = {};
const preventMultipleLogins = (req, res, next) => {
   const {user} = req;

   if (user) {
      const sessionId = req.sessionID;
      const userId = user.id;
      const existingSessionId = userSessions[userId];

      if (existingSessionId && existingSessionId !== sessionId) {
         const otherSocket = req.app.get('io').sockets.connected[existingSessionId];

         if (otherSocket) {
            otherSocket.emit('logout');
            req.logout(() => {
               req.session.destroy(() => {
                  res.clearCookie('connect.sid');
                  res.redirect('/login');
               });
            });
            return;
         }
      }
      userSessions[userId] = sessionId;
   }

   next();
};

const setMenuByRoles = (req, res, next) => {
   if (req.isAuthenticated()) {
      // console.log('UserRole:', req.user.role_id);
      switch (req.user.role_id) {
         case roles.ADMIN:
            // console.log('Admin Menu');
            res.locals.menu = menuByRoles.adminMenu;
            break;
         case roles.OWNER:
            // console.log('Owner Menu');
            res.locals.menu = menuByRoles.ownerMenu;
            break;
         case roles.DOCTOR:
            // console.log('Doctor Menu');
            res.locals.menu = menuByRoles.doctorsMenu;
            break;
         case roles.COUNSELLOR:
            res.locals.menu = menuByRoles.counsellerMenu;
            break;
         case roles.NURSE:
            res.locals.menu = menuByRoles.nurseMenu;
            break;
         default:
            res.locals.menu = null;
      }
   }
   // console.log(res.locals.menu);
   next();
};

module.exports = {
   ensureAuthenticated,
   ensureNotAuthenticated,
   ensureAdmin,
   checkRoles,
   preventMultipleLogins,
   setMenuByRoles,
};
