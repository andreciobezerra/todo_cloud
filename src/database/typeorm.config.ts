import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { config } from "dotenv";
import { DataType, newDb } from "pg-mem";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      type: "postgres",
      host: configService.get("DB_HOST"),
      port: Number(configService.get("DB_PORT")),
      username: configService.get("DB_USER"),
      password: configService.get("DB_PASSWORD"),
      database: configService.get("DB_NAME"),
      // autoLoadEntities: true,
      entities: [__dirname.concat("/../**/*.entity{.ts,.js}")],
    };
  },
};

export const typeormTestsConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: () => ({
    type: "postgres",
    entities: [__dirname.concat("/../**/*.entity{.ts,.js}")],
  }),
  dataSourceFactory: async () => {
    const db = newDb({
      autoCreateForeignKeyIndices: true,
    });

    db.public.registerFunction({
      implementation: () => "test",
      name: "current_database",
    });

    db.public.registerFunction({
      implementation: (val) => val === 1,
      args: [DataType.integer],
      returns: DataType.bool,
      name: "exists",
    });

    db.registerExtension("uuid-ossp", (schema) => {
      schema.registerFunction({
        name: "uuid_generate_v4",
        returns: DataType.uuid,
        implementation: randomUUID,
        impure: true,
      });
    });

    db.public.registerFunction({
      name: "version",
      implementation: () => "PostgreSQL 14.2, compiled by Visual C++ build 1914, 64-bit",
    });

    const ds: DataSource = await db.adapters.createTypeormDataSource({
      ...dataSourceOptions,
      migrationsRun: false,
      migrationsTransactionMode: "each",
      synchronize: false,
    });

    await ds.initialize();
    await ds.synchronize();

    return ds;
  },
};

config({ path: "dev-env/.env.development" });

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname.concat("/../**/*.entity{.ts,.js}")],
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: [__dirname.concat("/migrations/*")],
});

export const dataSourceSeeder: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  seeds: [__dirname.concat("/seeds/*")],
};
