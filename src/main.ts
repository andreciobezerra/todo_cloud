import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Worker } from "cluster";
import { availableParallelism } from "os";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import { ConfigService } from "@nestjs/config";
import { validationConfig } from "./app.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.NODE_ENV === "development" }),
  );

  // security configs.
  app.enableCors({ credentials: true });
  app.register(fastifyHelmet);
  app.register(fastifyCsrfProtection);

  // validation configs
  app.useGlobalPipes(new ValidationPipe(validationConfig));

  await app.listen(
    app.get(ConfigService).get<number>("APP_PORT") ?? 3000,
    app.get(ConfigService).get<string>("APP_ADDRESS") ?? "0.0.0.0",
  );
}

// This functions has the functionality of generate clusters
async function clusterize(callback: () => Promise<void>) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cluster = require("cluster");
  const cpus = process.env.NODE_ENV === "development" ? 1 : availableParallelism();

  if (cluster?.isPrimary) {
    Array(cpus)
      .fill(0)
      .forEach(() => cluster.fork());

    cluster.on("exit", (worker: Worker) => {
      console.info(`Worker ${worker.process.pid} died. Restarting`);
      cluster.fork();
    });
  } else {
    console.info(`Cluster server started on ${process.pid}`);
    callback();
  }
}

clusterize(bootstrap);
