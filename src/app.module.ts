import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./errors/all-exceptions.filter";

@Module({
  imports: [ConfigModule.forRoot(appConfig)],
  providers: [{
     provide: APP_FILTER, 
     useClass: AllExceptionsFilter 
   }],
})
export class AppModule {}
