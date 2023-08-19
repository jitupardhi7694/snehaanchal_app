const rateLimit = require('express-rate-limit');

const userRouteLimitter = rateLimit({
   windowMs: 2 * 60 * 1000, // 2 minutes
   max: 24, // Limit each IP to 24 reqs per `window` (here, per 2 minutes)
   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = userRouteLimitter;
