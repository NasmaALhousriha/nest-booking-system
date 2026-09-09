import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(incomingError: unknown, hostContext: ArgumentsHost) {
    const httpChannel = hostContext.switchToHttp();
    const serverResponse = httpChannel.getResponse<Response>();
    const incomingRequest = httpChannel.getRequest<Request>();

    let responseStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let extractedMessage: any = 'An unexpected internal error occurred.';

    if (incomingError instanceof HttpException) {
      responseStatusCode = incomingError.getStatus();
      const rawErrorPayload = incomingError.getResponse();
      
      extractedMessage = typeof rawErrorPayload === 'object' && rawErrorPayload !== null
        ? (rawErrorPayload as any).message
        : incomingError.message;
    } else if (incomingError instanceof Error) {
      extractedMessage = incomingError.message;
    }

    serverResponse.status(responseStatusCode).json({
      success: false,
      statusCode: responseStatusCode,
      timestamp: new Date().toISOString(),
      path: incomingRequest.url,
      message: extractedMessage,
    });
  }
}