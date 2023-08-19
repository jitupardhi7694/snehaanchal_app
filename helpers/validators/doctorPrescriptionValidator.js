const {body, validationResult} = require('express-validator');

const doctorPrescriptionsValidationRules = () => [
   body('patient_id').notEmpty().isNumeric().withMessage('Patient Id is required'),
   body('symptom_name')
      .notEmpty()
      .withMessage('Medication  is required')
      .isLength({min: 2, max: 256})
      .withMessage('Should have minimum 2 and maximum 256 characters'),
   body('medication_name')
      .notEmpty()
      .withMessage('Medication  is required')
      .isLength({min: 2, max: 256})
      .withMessage('Should have minimum 2 and maximum 256 characters'),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   doctorPrescriptionsValidationRules,
   validate,
};
