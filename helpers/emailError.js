const sendEmails = require('./init-gmail');
const logger = require('./winston');

async function sendEmail2JAK(errData) {
   const mailOptions = {
      to: 'nitinbetharia@gmail.com',
      cc: '',
      bcc: '',
      subject: 'Error in Snehaanchal Project!!',
      text: `Hi Team, <br><br>
    
      Following Error occurred in the system.<br>
      <b>${errData} </b> <br><br>

    Regards,<br>
    Snehaanchal System Server.
    `,
   };
   if (process.env.NODE_ENV === 'production') {
      // Send emails only when in production/not development or other env.
      sendEmails(mailOptions);
   } else {
      logger.info('Error Email Sent:', mailOptions);
      // testing purpose only
      sendEmails(mailOptions);
   }
}
module.exports = {sendEmail2JAK};
