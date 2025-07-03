// Updated validateRequest.js
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiErrors');


const validateRequest = (validations, validationType = 'body') => {
  return async (req, res, next) => {
    try {
      // Run validations
      await Promise.all(validations.map(validation => validation.run(req)));

      // Check for errors
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
          field: err.path,
          location: err.location,
          message: err.msg,
          value: err.value
        }));

        // Return 422 (Unprocessable Entity) for validation errors
        return next(new ApiError(422, 'Validation failed', true, errorMessages));
      }

      next();
    } catch (err) {
      // Handle unexpected validation errors
      next(new ApiError(500, 'Validation processing failed', false));
    }
  };
};

module.exports = validateRequest;