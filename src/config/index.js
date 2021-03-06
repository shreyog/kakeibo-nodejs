const dotenv = require("dotenv");
const path = require("path");
const Joi = require("@hapi/joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(9000),
    MONGODB_URI: Joi.string()
      .required()
      .description("Mongo DB URI is required"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    GOOGLE_CLIENT_ID: Joi.string().required().description("Google client Id"),
    GOOGLE_CLIENT_SECRET: Joi.string()
      .required()
      .description("Google client secret key"),
    GOOGLE_CALLBACK_URL: Joi.string()
      .required()
      .description("Google client secret key"),
    LOG_LEVEL: Joi.string()
      .default("debug")
      .required()
      .description("winston log level is required"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`⚠️ Config validation error: ${error.message} ⚠️`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    uri: envVars.MONGODB_URI,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  googleOAuth: {
    googleClientId: envVars.GOOGLE_CLIENT_ID,
    googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
    googleCallbackURL: envVars.GOOGLE_CALLBACK_URL,
  },
  logs: {
    level: envVars.LOG_LEVEL,
  },
  api: {
    prefix: "/api",
  },
};
