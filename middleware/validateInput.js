const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
};
