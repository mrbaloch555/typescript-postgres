import dotenv from "dotenv";
import Joi from "joi";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("pod", "dev", "stage", "test").required(),
    PORT: Joi.number().required().description("Port is required"),
    DDB_HOST: Joi.string().default("localhost"),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().default("user"),
    DB_PASSWORD: Joi.string().default("admin"),
    DB_DATABASE: Joi.string().default("typescriptsql"),
    JWT_SECRET: Joi.string().required().description("JWT Secret is required"),
    JWT_EXPIRATION_ACCESS: Joi.string().description(
      "JWT Expiration time is required!"
    ),
    JWT_EXPIRATION_REFRESH: Joi.string().description(
      "JWT Expiration time is required!"
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({
    errors: { label: "key" },
  })
  .validate(process.env);

if (error) {
  throw new Error(`Config validations error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtScret: envVars.JWT_SECRET,
  jwtExpirationAccess: envVars.JWT_EXPIRATION_ACCESS,
  jwtExpirationRefresh: envVars.JWT_EXPIRATION_REFRESH,
  dbHost: envVars.DDB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_DATABASE,
};

export default config;
