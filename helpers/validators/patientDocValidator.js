const {body, validationResult} = require('express-validator');

const patientDocsValidation = () => [
   body('patientId').notEmpty().isNumeric().withMessage('Patient Id is required'),
   body('docName')
      .notEmpty()
      .withMessage('Document name  is required')
      .isLength({min: 2, max: 150})
      .withMessage('Should have minimum 2 and maximum 150 characters'),
];

const validate = (req, res, next) => {
   const errors = validationResult(req);
   const extractedErrors = [];
   errors.array().map((error) => extractedErrors.push({msg: error.msg}));
   req.ValidateErrors = extractedErrors;
   return next();
};

module.exports = {
   patientDocsValidation,
   validate,
};
