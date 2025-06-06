import Joi from 'joi';
export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  email: Joi.string().email().required(),
});
