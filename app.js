const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const useragent = require('express-useragent');
const morgan = require('morgan');
const logger = require('./helpers/winston');
const sessionStore = require('./helpers/init-sessionStore');
const {setMenuByRoles} = require('./helpers/auth-helper');

require('dotenv').config();

// Bring in passport config
require('./helpers/init-passport')(passport);

const app = express();

// middleware
app.use(morgan('combined', {stream: logger.stream})); // log reqs to winston
app.use(helmet({contentSecurityPolicy: false}));
app.use(compression({level: 6}));
app.use(cors());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main_layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use(useragent.express());

// body parsers
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({limit: '60mb', extended: false}));

// configure the session, passport and flash
const hour = 60 * 60 * 1000; // (60min * (60sec *1000millisecond)
const halfHour = hour / 2;
app.set('trust proxy', 1); // trust first proxy
app.use(
   session({
      store: sessionStore,
      name: 'sessionID',
      secret: 'Gvv8V}CGBk5-r;RK}}z))e{#S:%aG1U+%t8;b0epoT57|;9k4bVy]mG8cm=}SnehaAnchal',
      resave: false,
      saveUninitialized: true,
      cookie: {maxAge: halfHour},
   })
);
// // secure cookies in production env.
// if (process.env.NODE_ENV !== 'production') {
//   session.cookie.secure = true; // serve secure cookies
// }

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables using custom middleware
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.isAuthenticated = req.isAuthenticated();
   res.locals.userDataName = req.user;
   res.locals.userAgent = req.useragent;
   next();
});

app.use(setMenuByRoles);
// session test middleware -
app.get('/sessionData', (req, res) => {
   if (req.session.views) {
      req.session.views += 1;
      res.setHeader('Content-Type', 'text/html');
      res.write(`<p>views: ${req.session.views}</p>`);
      res.write(`<p>expires in: ${req.session.cookie.maxAge / 1000}s</p>`);
      res.write(`<p>Original MaxAge: ${req.session.cookie.originalMaxAge}</p>`);
      res.write('---------------');
      res.write(JSON.stringify(req.useragent));
      res.write(req?.remoteAddress || '');
      res.end();
      // console.log(req.useragent);
   } else {
      req.session.views = 1;
      res.end('welcome to the session view, refresh for session data!');
   }
});

// Define routes and custom middleware
app.use('/', require('./routes/homeRoute'));
app.use('/users', require('./routes/usersRoute'));
app.use('/patient', require('./routes/patientRoute'));
app.use('/religion', require('./routes/religionRoute'));
app.use('/language', require('./routes/languageRoute'));
app.use('/user_roles', require('./routes/userRolesRoute'));
app.use('/patient_type', require('./routes/patientTypeRoute'));
app.use('/counseller', require('./routes/counsellerRoute'));
app.use('/staff', require('./routes/staffRoute'));
app.use('/medication', require('./routes/medicationRoute'));
app.use('/counsellerAdmin', require('./routes/consellerAdminRoute'));
app.use('/prescriptions', require('./routes/prescriptionsRoute'));
app.use('/symptoms', require('./routes/symptomsRoute'));
app.use('/visits', require('./routes/visitsRoute'));
app.use('/nurse', require('./routes/nurseRoute'));
app.use('/doctor_prescription', require('./routes/doctorPrescriptionRoute'));
app.use('/patient_docs', require('./routes/patientDocRoute'));

// catch 404 and forward to error handler, should be after all known routes
app.use((req, res) => {
   res.render('errPages/show404', {path: req.url});
});

// error handler, this has to be last middleware
app.use((err, req, res) => {
   logger.error(err);
   return res.render('errPages/showGenericErr', {err: err.message});
});

// Set PORT and START server
const httpPort = process.env.PORT || 8000;
app.listen(httpPort, () => {
   logger.info(`Server started at http://localhost:${httpPort}`);
});
