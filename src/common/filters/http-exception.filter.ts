import {ExceptionFilter,Catch, ArgumentsHost,HttpException,HttpStatus,Logger,} from '@nestjs/common';
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

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responsePayload = exception.getResponse();
      
      if (typeof responsePayload === 'string') {
        message = responsePayload;
      } else if (typeof responsePayload === 'object' && responsePayload !== null) {
        const payload = responsePayload as Record<string, unknown>;
        message = (payload.message as string | string[]) || exception.message;
      }
    } 
    
    else {
      const errorStack = exception instanceof Error ? exception.stack : 'Unknown stack';
      const errorMessage = exception instanceof Error ? exception.message : 'Unknown error';
      
      this.logger.error(
        `[500 Internal Error] ${request.method} ${request.url} - Error: ${errorMessage}`,
        errorStack,
      );

      message = 'An unexpected internal error occurred on the server.';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}