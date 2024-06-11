import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig, typeormTestsConfig } from "./typeorm.config";

@Module({
  imports: [
    process.env.NODE_ENV === "test"
      ? TypeOrmModule.forRootAsync(typeormTestsConfig)
      : TypeOrmModule.forRootAsync(typeormConfig),
  ],
})
export class DatabaseModule {}
