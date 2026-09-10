import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        error = exception.name;
      } else if (typeof res === 'object' && res !== null) {
        const payload = res as Record<string, unknown>;
        message = (payload.message as string | string[]) || exception.message;
        error = (payload.error as string) || exception.name;
      }
    } else {
      const errorStack = exception instanceof Error ? exception.stack : 'Unknown stack';
      const errorMessage = exception instanceof Error ? exception.message : 'Unknown error';

      this.logger.error(
        `[500] ${request.method} ${request.url} - ${errorMessage}`,
        errorStack,
      );
      message = 'An unexpected internal error occurred on the server.';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}