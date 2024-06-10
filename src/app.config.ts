import { ValidationPipeOptions } from "@nestjs/common";
import type { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";

export const appConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [".env.development", ".env.production"],
  validationSchema: Joi.object({
    JWT_SECRET: Joi.string().required(),
    APP_PORT: Joi.number(),
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
