// Check for compatible browser

const browserErrMessage = 'Unsupported Browser detected.  Please use chrome or firefox or latest version of edge';

const isSupportedBrowser = (req, res, next) => {
   const clientBrowserName = (req.useragent.browser || '').toLowerCase();
   // console.log('Name:', clientBrowserName, 'Ver:', req.useragent.version);
   switch (clientBrowserName) {
      case 'ie':
         res.send(browserErrMessage);
         break;
      case 'edge':
         if (parseInt(req.useragent.version, 10) >= 79) {
            next();
         } else {
            res.send(browserErrMessage);
         }
         break;
      case 'chrome':
      case 'firefox':
      case 'postmanruntime':
         next();
         break;
      default:
         res.send(browserErrMessage);
   }
};

module.exports = isSupportedBrowser;
