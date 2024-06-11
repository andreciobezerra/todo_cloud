import { ValidationPipeOptions } from "@nestjs/common";
import type { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";

export const appConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ["./dev-env/.env.development", ".env.production"],
  validationSchema: Joi.object({
    JWT_SECRET: Joi.string().required(),
    APP_PORT: Joi.number(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
  }),
};

export const validationConfig: ValidationPipeOptions = {
  whitelist: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    return {
      code: 400,
      message: errors.map((err) => Object.values(err.constraints)).join(","),
    };
  },
};
