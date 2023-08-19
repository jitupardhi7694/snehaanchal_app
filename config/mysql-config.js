let dbconfig = {};
switch (process.env.NODE_ENV) {
   case 'production':
      dbconfig = {
         HOST: '140.238.167.36',
         PORT: '3306',
         USER: 'snehaa',
         PWD: 'Sneha@123#',
         DB: 'snehaanchal',
      };
      break;
   case 'test':
      dbconfig = {
         HOST: '140.238.167.36',
         PORT: '3306',
         USER: 'snehaa',
         PWD: 'Sneha@123#',
         DB: 'snehaanchal',
      };
      break;
   default:
      dbconfig = {
         HOST: '140.238.167.36',
         PORT: '3306',
         USER: 'snehaa',
         PWD: 'Sneha@123#',
         DB: 'snehaanchal',
      };
      break;
}
console.log(dbconfig);
module.exports = dbconfig;
