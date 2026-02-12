const ApiError = require('../utils/ApiError');

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed; // Replace body with parsed (trimmed, transformed) data
    next();
  } catch (error) {
    // Pass Zod error to centralized error handler
    next(error);
  }
};

module.exports = validate;
