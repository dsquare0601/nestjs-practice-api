import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../constants/http-status.constants';

export class BusinessException extends HttpException {
  constructor(
    message: string = ErrorMessages.BAD_REQUEST,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode,
        message,
        error: 'Business Logic Error',
      },
      statusCode,
    );
  }
}
