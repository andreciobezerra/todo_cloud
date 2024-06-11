import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./errors/all-exceptions.filter";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./tasks/tasks.module";
import { DatabaseModule } from "./database/database.module";
import { UserDataMiddleware } from "./users/middlewares/user-data.middleware";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [ConfigModule.forRoot(appConfig), AuthModule, DatabaseModule, UsersModule, TasksModule],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserDataMiddleware)
      .exclude("auth/login", { path: "users", method: RequestMethod.POST })
      .forRoutes("*");
  }
}
