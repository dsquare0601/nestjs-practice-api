<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A comprehensive NestJS practice API showcasing best practices for building production-ready RESTful APIs with TypeScript. This project demonstrates authentication, CRUD operations, validation, error handling, and comprehensive testing strategies.</p>

## Features Implemented

### 🔐 Authentication Module

- JWT-based authentication with access and refresh tokens
- User registration with password hashing using bcrypt
- Login/logout functionality
- Token refresh mechanism
- Protected routes with JWT guards
- Password confirmation validation

### 📦 Products CRUD Module

- Complete CRUD operations (Create, Read, Update, Delete)
- Pagination, filtering, and sorting
- Search functionality
- Bulk operations (create, update, delete multiple products)
- Custom DTOs with validation
- Business logic validation

### ✅ Input Validation

- Class-validator and class-transformer integration
- Custom validation decorators:
  - [`IsNoSpaces`](src/common/decorators/validation.decorators.ts) - Ensures strings contain no spaces
  - [`IsPriceRange`](src/common/decorators/validation.decorators.ts) - Validates price within range
  - [`Match`](src/common/decorators/validation.decorators.ts) - Matches fields (e.g., password confirmation)
- Custom pipes:
  - [`TrimPipe`](src/common/pipes/trim.pipe.ts) - Trims whitespace from inputs
  - [`CustomValidationPipe`](src/common/pipes/custom-validation.pipe.ts) - Custom validation error formatting
- Transform decorators for data sanitization

### 🛡️ Error Handling

- Global exception filters:
  - [`AllExceptionsFilter`](src/common/filters/http-exception.filter.ts) - Catches all HTTP exceptions
  - [`DatabaseExceptionFilter`](src/common/filters/database-exception.filter.ts) - Handles database errors
  - [`ValidationExceptionFilter`](src/common/filters/validation-exception.filter.ts) - Formats validation errors
- Custom exceptions:
  - [`BusinessException`](src/common/exceptions/business.exception.ts) - Business logic errors
  - [`DatabaseException`](src/common/exceptions/database.exception.ts) - Database operation errors
- Standardized error response format
- Detailed error logging with [`CustomLoggerService`](src/common/services/logger.service.ts)

### 🧪 Testing

- Comprehensive unit tests for services and controllers
- Mocking strategies for dependencies
- Guard and interceptor testing
- Test coverage reporting
- E2E tests setup

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (jsonwebtoken), Passport
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                 # Login/Register DTOs
│   ├── guards/              # JWT auth guards
│   ├── strategies/          # Passport JWT strategy
│   └── interfaces/          # Request interfaces
├── common/                  # Shared resources
│   ├── constants/           # HTTP status messages
│   ├── decorators/          # Custom validation decorators
│   ├── exceptions/          # Custom exception classes
│   ├── filters/             # Exception filters
│   ├── pipes/               # Custom pipes
│   └── services/            # Logger service
├── products/                # Products CRUD module
│   ├── dto/                 # Product DTOs
│   ├── entities/            # Product entity
│   └── ...
└── users/                   # User entity
```

## Project Setup

```bash
# Install dependencies
$ npm install

# Setup environment variables
$ cp .env.example .env
# Update .env with your database credentials and JWT secrets
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d

# Server
PORT=3000
```

## Compile and Run the Project

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Run Tests

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token (protected)
- `POST /auth/logout` - Logout user (protected)

### Products

- `GET /products` - Get all products (with pagination, search, filter)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (protected)
- `PATCH /products/:id` - Update product (protected)
- `DELETE /products/:id` - Delete product (protected)
- `POST /products/bulk` - Create multiple products (protected)
- `DELETE /products/bulk/delete` - Delete multiple products (protected)
- `PATCH /products/bulk/update` - Update multiple products (protected)

## Key Implementations

### Custom Validation Decorators

```typescript
// Password without spaces
@IsNoSpaces({ message: 'Password cannot contain spaces' })
password: string;

// Price range validation
@IsPriceRange(0, 100000, { message: 'Price must be between 0 and 100000' })
price: number;

// Password confirmation
@Match('password', { message: 'Passwords do not match' })
confirmPassword: string;
```

### Exception Handling

All exceptions are caught and formatted consistently:

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint",
  "method": "POST",
  "message": "Error message",
  "errors": [...]
}
```

### Authentication Guards

Protected routes use [`JwtAuthGuard`](src/auth/guards/jwt-auth.guard.ts):

```typescript
@UseGuards(JwtAuthGuard)
@Post('products')
create(@Body() dto: CreateProductDto) {
  return this.productsService.create(dto);
}
```

## Code Quality

```bash
# Lint code
$ npm run lint

# Format code
$ npm run format
```

## Stay in Touch

- Author - [Dsquare](https://www.linkedin.com/in/dsquare0601/)
- Website - [https://iamdsquare.vercel.app/](https://iamdsquare.vercel.app/)
- Twitter - [@dsquare0601](https://twitter.com/dsquare0601)
