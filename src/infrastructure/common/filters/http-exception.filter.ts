import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as ErrorResponse;

    const error =
      typeof errorResponse === 'string'
        ? errorResponse
        : Array.isArray(errorResponse.message)
          ? errorResponse.message.join(', ')
          : errorResponse.message || exception.message;

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - ${error}`,
      exception.stack,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
    });
  }
}
