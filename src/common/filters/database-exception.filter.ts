import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { message } = exception;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Database error occurred';

    // Handle specific database errors
    if (message.includes('duplicate key')) {
      status = HttpStatus.CONFLICT;
      errorMessage = 'Resource already exists';
    } else if (message.includes('foreign key constraint')) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = 'Cannot delete resource with existing references';
    } else if (message.includes('not found')) {
      status = HttpStatus.NOT_FOUND;
      errorMessage = 'Resource not found';
    }

    this.logger.error(`Database error: ${message}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
