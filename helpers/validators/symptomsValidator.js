const {body, validationResult} = require('express-validator');

const symptomsValidationRules = () => [
   body('patient_id').notEmpty().isNumeric().withMessage('Patient Id is required'),

   body('symptom_name')
      .notEmpty()
      .withMessage('Symptom Name is required')
      .isLength({max: 100})
      .withMessage('Should have minimum 2 and maximum 100 characters'),

   body('severity')
      .notEmpty()
      .withMessage('severity Name is required')
      .isLength({max: 100})
      .withMessage('Should have minimum 2 and maximum 100 characters'),

   body('date_reported').isEmpty().withMessage('date of reported is required'),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   symptomsValidationRules,
   validate,
};
