# Movie API

## Overview

A comprehensive REST API built with NestJS for managing movies with secure authentication, image uploads, and automated email notifications. The system enables users to register, authenticate, and perform full CRUD operations on movies, with features including advanced filtering, pagination, cloud storage integration, and scheduled release notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **NestJS with TypeScript**: Modern Node.js framework providing modular architecture with dependency injection, decorators, and strong typing
- **Module-based architecture**: Organized into feature modules (Auth, Users, Movies, Upload, Mail, Scheduler) for separation of concerns and maintainability
- **Global validation**: Centralized request validation using `class-validator` and `class-transformer` with DTOs (Data Transfer Objects)

### Database Layer
- **Prisma ORM**: Type-safe database client with schema-first approach
- **PostgreSQL**: Relational database (configured through Prisma, connection details in environment variables)
- **Global Prisma Module**: Single PrismaService instance shared across all modules to manage database connections efficiently

### Authentication & Authorization
- **JWT (JSON Web Tokens)**: Stateless authentication with configurable expiration (default: 7 days)
- **Passport.js with JWT Strategy**: Standardized authentication middleware
- **bcrypt**: Secure password hashing with salt rounds
- **Route Guards**: `JwtAuthGuard` protects endpoints requiring authentication
- **Ownership validation**: Users can only modify their own movie records

### API Documentation
- **Swagger/OpenAPI**: Auto-generated interactive API documentation at `/api/docs`
- **Organized by tags**: Authentication, Movies, Upload endpoints grouped logically
- **Bearer token support**: Built-in authentication testing in Swagger UI

### Core Features Architecture

#### Movie Management
- **CRUD operations**: Create, Read, Update, Delete with ownership enforcement
- **Advanced filtering**: Multi-parameter search (title, genre, duration range, release date range)
- **Pagination**: Configurable page-based pagination (default: 10 items per page)
- **Data relationships**: Movies linked to users via foreign key with Prisma relations

#### File Upload System
- **AWS S3 integration**: Cloud storage for movie poster images
- **File validation**: Type checking (JPEG, PNG, WebP) and size limits (5MB max)
- **Multer middleware**: Handles multipart/form-data file uploads
- **UUID-based naming**: Prevents filename conflicts in S3 bucket
- **Graceful degradation**: Service checks for AWS credentials and fails gracefully if not configured

#### Email Notification System
- **Nodemailer**: SMTP-based email delivery
- **Configurable transport**: Supports any SMTP server (defaults to Ethereal for testing)
- **Conditional sending**: Only sends emails when SMTP credentials are configured
- **HTML email templates**: Formatted notification messages

#### Task Scheduling
- **@nestjs/schedule with node-cron**: Automated background tasks
- **Daily release checker**: Runs every day at 8:00 AM to find movies releasing that day
- **Automated notifications**: Sends email reminders to users about their movie releases
- **Error handling**: Catches and logs failures without breaking the scheduler

### Configuration Management
- **@nestjs/config**: Environment-based configuration
- **Global config module**: Available throughout the application
- **Required environment variables**:
  - `JWT_SECRET`: Token signing key
  - `JWT_EXPIRATION`: Token validity period
  - `DATABASE_URL`: PostgreSQL connection string
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_REGION`: S3 upload configuration
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: Email configuration

### API Design Patterns
- **RESTful conventions**: Standard HTTP methods and status codes
- **DTO pattern**: Request/response validation and transformation
- **Decorator-based routing**: Clean, declarative endpoint definitions
- **Dependency injection**: Loose coupling between services
- **Service layer separation**: Business logic isolated from controllers

### Error Handling
- **Built-in NestJS exceptions**: Proper HTTP status codes (401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict)
- **Validation pipe**: Automatic request validation with detailed error messages
- **Whitelist mode**: Strips unknown properties from requests for security

### CORS & Security
- **CORS enabled**: Allows cross-origin requests for frontend integration
- **Request validation**: Whitelist and forbid non-whitelisted properties
- **Password security**: Never exposes password hashes in responses
- **Bearer token authentication**: Industry-standard authorization header

## External Dependencies

### Cloud Services
- **AWS S3**: Object storage for movie poster images
  - Requires: Access Key ID, Secret Access Key, Bucket Name, Region
  - SDK: `@aws-sdk/client-s3` v3

### Database
- **PostgreSQL**: Primary data store
  - Accessed via Prisma ORM
  - Connection string format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

### Email Service
- **SMTP Server**: Email delivery (any SMTP-compatible service)
  - Examples: Gmail, SendGrid, Ethereal (testing)
  - Requires: Host, Port, Username, Password

### NPM Packages
- **Core Framework**: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- **Authentication**: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- **Database**: `@prisma/client`, `prisma`
- **Validation**: `class-validator`, `class-transformer`
- **Documentation**: `@nestjs/swagger`
- **File Upload**: `multer` (via NestJS), `@aws-sdk/client-s3`, `uuid`
- **Email**: `nodemailer`
- **Scheduling**: `@nestjs/schedule`, `node-cron`
- **Configuration**: `@nestjs/config`
- **Utilities**: `rxjs`, `reflect-metadata`