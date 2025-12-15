import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error on extra properties
      transform: true, // Auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true, // Convert query params automatically
      },
      disableErrorMessages: false, // Show validation errors
      exceptionFactory: (errors) => {
        // Custom error format
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          value: error.value,
          constraints: error.constraints,
        }));

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
    new ValidationExceptionFilter(),
    new DatabaseExceptionFilter(),
    new AllExceptionsFilter(),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
