const {body, validationResult} = require('express-validator');

const visitsValidationRules = () => [
   body('patient_id').notEmpty().isNumeric().withMessage('Patient Id is required'),
   body('staff_id').notEmpty().isNumeric().withMessage('Staff Id is required'),
   body('notes').notEmpty().isLength({max: 500}).withMessage(' Notes is required').trim().escape(),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   visitsValidationRules,
   validate,
};
