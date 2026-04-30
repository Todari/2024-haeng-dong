import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { captureException } from './sentry';

// Catches everything HttpExceptionFilter doesn't (non-HttpException) and any
// HttpException whose status is >= 500. 4xx user errors are skipped — they're
// noise in the alert channel.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : 500;

    if (status >= 500) {
      captureException(exception, {
        url: request.url,
        method: request.method,
      });
      const stack =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(`${request.method} ${request.url} → ${status}`, stack);
    }

    if (isHttp) {
      const body = exception.getResponse();
      response
        .status(status)
        .json(typeof body === 'string' ? { message: body } : body);
    } else {
      response.status(500).json({
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      });
    }
  }
}
