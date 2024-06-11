import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./errors/all-exceptions.filter";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./tasks/tasks.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [ConfigModule.forRoot(appConfig), DatabaseModule, UsersModule, TasksModule],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
