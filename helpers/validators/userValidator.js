const {body, validationResult} = require('express-validator');

const userValidationRules = () => [
   // username must be an email
   body('name').notEmpty().withMessage('Name is required'),
   body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Not a Valid Email')
      .trim()
      .normalizeEmail(),
   body('password').isLength({min: 8, max: 25}).withMessage('Password has to be min 8 chars and max 25 char long.'),
   body('password2')
      .notEmpty()
      .withMessage('Confirm Password cannot be blank.')
      .custom((value, {req}) => {
         if (value !== req.body.password) {
            // throw error if passwords do not match
            throw new Error("Passwords don't match");
         } else {
            return value;
         }
      }),
];

const changePasswordRules = () => [
   body('password').isLength({min: 8, max: 25}).withMessage('Password has to be min 8 chars and max 25 char long.'),
   body('password2')
      .notEmpty()
      .withMessage('Confirm Password cannot be blank.')
      .custom((value, {req}) => {
         if (value !== req.body.password) {
            // throw error if passwords do not match
            throw new Error("Passwords don't match");
         } else {
            return value;
         }
      }),
];

const profileValidationRules = () => [
   body('address').notEmpty().withMessage('Address is required'),
   body('city').notEmpty().withMessage('City cannot be blank.'),
   body('state').notEmpty().withMessage('State cannot be blank.'),
   body('pincode')
      .notEmpty()
      .withMessage('Pin code is needed.')
      .isNumeric()
      .withMessage('Pin code has to be just numbers')
      .isLength({min: 6, max: 6})
      .withMessage('Pin Code has to be 6 characters'),
   body('phone')
      .notEmpty()
      .withMessage('Phone is needed.')
      .isNumeric()
      .withMessage('Phone number has to be just numbers')
      .isLength({min: 10, max: 10})
      .withMessage('Phone number has to be 10 characters'),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   userValidationRules,
   changePasswordRules,
   profileValidationRules,
   validate,
};
