const {body, validationResult} = require('express-validator');

const religionValidationRules = () => [
   body('religionName')
      .notEmpty()
      .withMessage('Religion Name is required')
      .isLength({min: 2, max: 50})
      .withMessage('Should have minimum 2 and maximum 50 characters'),
];

const languageValidationRules = () => [
   body('languages')
      .notEmpty()
      .withMessage('Langauge Name is required')
      .isLength({min: 2, max: 50})
      .withMessage('Should have minimum 2 and maximum 50 characters'),
];
const userRoleValidationRules = () => [
   body('roleName')
      .notEmpty()
      .withMessage('User Role Name is required')
      .isLength({min: 2, max: 50})
      .withMessage('Should have minimum 2 and maximum 50 characters'),
];
const patientTypeValidationRules = () => [
   body('typeCode')
      .notEmpty()
      .withMessage(' Patient Type is required')
      .isLength({min: 2, max: 50})
      .withMessage('Should have minimum 2 and maximum 50 characters'),
];

const staffValidationRules = () => [
   body('first_name')
      .notEmpty()
      .withMessage('First Name is required')
      .isLength({max: 100})
      .withMessage('Should have minimum 2 and maximum 100 characters'),
   body('last_name')
      .notEmpty()
      .withMessage('Last Name is required')
      .isLength({max: 100})
      .withMessage('Should have minimum 2 and maximum 100 characters'),

   body('address')
      .notEmpty()
      .withMessage('Address is required')
      .isLength({max: 250})
      .withMessage('Should have minimum 2 and maximum 100 characters'),
   body('city').notEmpty().withMessage('city is required').isLength({max: 30}),
   body('state').notEmpty().withMessage('state is required').isLength({max: 30}),
   body('zip_code').notEmpty().withMessage('zip code is required').isLength({max: 30}),
   body('phone_number').notEmpty().withMessage('phone number is required').isLength({max: 10}).isNumeric(),
   body('position').notEmpty().withMessage('position is required').isLength({max: 100}),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   religionValidationRules,
   languageValidationRules,
   userRoleValidationRules,
   patientTypeValidationRules,
   validate,
   staffValidationRules,
};
