const {body, validationResult} = require('express-validator');

const prescriptionsValidationRules = () => [
   body('patient_id').notEmpty().isNumeric().withMessage('Patient Id is required'),
   body('staff_id').notEmpty().isNumeric().withMessage('Staff Id is required'),
   body('medication_id').notEmpty().isNumeric().withMessage('Medication Id is required'),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   prescriptionsValidationRules,
   validate,
};
