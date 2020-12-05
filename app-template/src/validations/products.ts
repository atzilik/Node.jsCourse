import joi from 'joi';

export const idSchema = joi.string().length(36);

export const newProductSchema = joi.object().keys({
  id: joi.string().length(36),
  name: joi.string().min(3).required(),
});
