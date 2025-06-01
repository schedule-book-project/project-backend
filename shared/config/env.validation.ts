import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

// Define the schema for environment variables
const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  GATEWAY_PORT: Joi.number().required(),
  BUSINESS_PORT: Joi.number().required(),
  BOOKING_PORT: Joi.number().required(),
  REVIEW_PORT: Joi.number().required(),
  PLACES_PORT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  HERE_API_KEY: Joi.string().required(),
  ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
}).unknown();

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

export default envVars;
