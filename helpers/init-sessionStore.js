const session = require('express-session');

// configure the session storage to mysql db
const mysql2 = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);
const dbConfig = require('../config/mysql-config');

const sessionDBOptions = {
   host: dbConfig.HOST,
   port: dbConfig.PORT,
   user: dbConfig.USER,
   password: dbConfig.PWD,
   database: 'snehaa_sessions',
};
const connection = mysql2.createPool(sessionDBOptions);
const sessionStore = new MySQLStore({}, connection);

module.exports = sessionStore;
