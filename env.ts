import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().allow('development', 'test').default('development'),
  SECRET_KEY: Joi.string().required(),
  POSTGRES_DB_NAME: Joi.string().required(),
  POSTGRES_DB_USER: Joi.string().required(),
  POSTGRES_DB_PASSWORD: Joi.string().required(),
  POSTGRES_DB_PORT: Joi.string().required(),
  POSTGRES_DB_HOST: Joi.string().required(),
});
