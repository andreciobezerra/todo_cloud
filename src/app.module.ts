import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AllExceptionsFilter } from "./errors/all-exceptions.filter";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./tasks/tasks.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { CookieAuthGuard } from "./auth/cookie-auth.guard";

@Module({
  imports: [ConfigModule.forRoot(appConfig), AuthModule, DatabaseModule, UsersModule, TasksModule],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: CookieAuthGuard },
  ],
})
export class AppModule {}
