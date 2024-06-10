import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { ICustomError } from "./custom-error.interface";

type ErrorType = HttpException | ICustomError;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ErrorType, host: ArgumentsHost) {
    const statusCode = exception instanceof HttpException ? exception.getStatus() : exception.code;

    const responseBody = {
      message: exception.message,
      stackTrace: exception.stack,
      time: new Date().toISOString(),
    };

    this.httpAdapterHost.httpAdapter.reply(
      host.switchToHttp().getResponse(),
      responseBody,
      statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
