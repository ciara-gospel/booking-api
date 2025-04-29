import Joi from "joi";

// Schéma d'inscription (Register)
const registerValidator = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }) // meilleur message d'erreur
});

// Middleware de validation pour l'inscription
export const validate = (req, res, next) => {
  const { error } = registerValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Schéma de connexion (Login)
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware de validation pour la connexion
export const loginValidator = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, {abortEarly: false});
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
