let hostConfig = {};
switch (process.env.NODE_ENV) {
   case 'production':
      hostConfig = {
         PROTOCOL: 'http',
         HOST: '140.238.167.36',
         PORT: '8000',
      };
      break;
   case 'test':
      hostConfig = {
         PROTOCOL: 'http',
         HOST: 'snehaanchal.org',
         PORT: process.env.PORT || 3000,
      };
      break;
   default:
      // development environment
      hostConfig = {
         PROTOCOL: 'http',
         HOST: 'localhost',
         PORT: process.env.PORT || 3000,
      };
      break;
}
console.log(process.env.NODE_ENV, hostConfig);
module.exports = hostConfig;
