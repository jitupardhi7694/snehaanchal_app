const {body, validationResult} = require('express-validator');

const patientValidationRules = () => [
   body('name').notEmpty().isLength({max: 75}).withMessage('Name is required').trim().escape(),
   body('age').notEmpty().isNumeric().withMessage('Age is required'),
   // body('gender').notEmpty().matches('M|F|O').withMessage('Gender is required'),
   body('aadhar').notEmpty().matches('^[0-9]{12}$').withMessage('Invalid aadhar number'),
   // body('local_address').notEmpty().trim().escape().isLength({ max: 500 }).withMessage('Local address is required'),
   // body('local_city').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Local city is required'),
   // body('local_landmark').notEmpty().trim().escape().isLength({ max: 65 }).withMessage('Local landmark is required'),
   // body('local_phone1').notEmpty().matches('^[0-9]{10}$').withMessage('Invalid local phone 1 number'),
   // body('fathers_name').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Fathers name is required'),
   // body('mothers_name').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Mothers name is required'),
   // body('religion').notEmpty().trim().escape().isLength({ max: 75 }).withMessage('Religion is required'),
   // body('language').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Language is required'),
   // body('admit_name').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Admit name is required'),
   // body('admit_relation').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Admit relation is required'),
   // body('admit_address').notEmpty().trim().escape().isLength({ max: 500 }).withMessage('Admit address is required'),
   // body('admit_city').notEmpty().trim().escape().isLength({ max: 45 }).withMessage('Admit city is required'),
   // body('admit_phone').notEmpty().matches('^[0-9]{10}$').withMessage('Invalid admit phone number'),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   patientValidationRules,
   validate,
};
