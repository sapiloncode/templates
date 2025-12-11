# Sapilon Template: Node API v2.0.0

## Overview
This project was generated using the Sapilon Node API template version 2.0.0.

## Important Paths
- Config files are in `config/config.ts` (moved from `config/index.ts` in v1).
- Application entry point is `src/main.ts`.

## Rules for AI Code Agents
- ✅ Always modify files inside `src/` — never auto-generate outside it.
- ⚠️ Do not delete or rewrite `.sapilon/` files.
- 🧩 When generating configs, check if `config/config.ts` exists first.
- 🔄 If upgrading from 1.0.0, move config/index.ts → config/config.ts.
- If there is a [filename].base.* file, preferably apply the changes in [filename].*

## Project Structure

```
/api
├── .env                    ← Environment variables (not tracked)
├── .gitignore              ← Git ignore rules
├── package.json            ← Dependencies and scripts
├── package-lock.json       ← Locked dependency versions
├── tsconfig.json           ← TypeScript configuration
├── tsup.config.json       ← Build configuration
├── jest.config.js          ← Test configuration
├── nodemon.json            ← Development server configuration
├── Dockerfile              ← Container configuration
├── Dockerfile.lambda       ← Lambda-specific container config
├── openapi.yaml            ← OpenAPI specification
├── README.md               ← Project documentation
├── CHANGELOG.md            ← Version history
├── commit.txt              ← Commit message template
│
├── /prisma                 ← Database schema and migrations
│   ├── schema.prisma       ← Database schema definition
│   └── /migrations         ← Database migration files
│
├── /src                    ← Source code
│   ├── /__test__           ← Test files
│   │
│   ├── /assets             ← Static assets and utilities
│   │
│   ├── /config             ← Configuration management
│   │
│   ├── /constants          ← Application constants
│   │
│   ├── /core               ← Singleton services (e.g. database connection)
│   │
│   ├── /lib                ← Utilities and integrations
│   │
│   ├── /modules            ← Business logic and use cases
│   │
│   ├── /openapi            ← API layer (auto-generated, don't edit manually)
│   │
│   ├── /types              ← Type definitions
│   │
│   ├── index.ts            ← Development entry point
│   └── lambda.ts           ← AWS Lambda entry point
│
└── /build                  ← Compiled JavaScript output
```

## Architecture Layers

### 1. Entry Points (`src/index.ts`, `src/lambda.ts`)

- **Development**: `index.ts` - Local development server entry point
- **Production**: `lambda.ts` - AWS Lambda handler for serverless deployment
- Both initialize configuration and create the Express application

### 2. Configuration (`src/config/`)

- Environment variable management
- Service configuration initialization
- AWS parameter store integration

### 3. Core Services (`src/core/`)

- Singleton services (database connections, etc.)
- Shared service instances
- Core business infrastructure

### 4. API Layer (`src/api/`)

- HTTP type definitions
- Status code constants
- OpenAPI integration
- Base API utilities

### 5. Features (`src/features/`)

- **Business Logic**: Core use cases and operations
- **Domain Models**: Business entities and DTOs
- **Data Transformation**: Mapping between internal and external representations
- Organized by domain (account, contact, file, message, etc.)

### 6. Handlers (`src/handlers/`)

- **HTTP Request Handling**: Express route handlers
- **Request/Response Processing**: Input validation and output formatting
- **Orchestration**: Coordinating feature calls
- Organized by resource/endpoint

### 7. Middleware (`src/middleware/`)

- **Authentication**: JWT token validation
- **Logging**: Request/response logging
- **Validation**: Input validation using Joi
- **Error Handling**: Centralized error processing

### 8. Utilities (`src/lib/`)

- **AWS Integration**: S3, SSM, CloudWatch services
- **Runtime Utilities**: Application creation, logging, memory monitoring
- **General Utilities**: Date serialization, OpenAPI operations

## Key Technologies

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Deployment**: AWS Lambda (serverless)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with OpenID Connect
- **File Storage**: AWS S3
- **Configuration**: AWS Systems Manager Parameter Store
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Jest with Supertest
- **Build**: tsup (TypeScript bundler)

## Development Workflow

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run test` - Run test suite
- `npm run api:generate` - Generate OpenAPI client code
- `npm run aws:login` - Authenticate with AWS SSO

### Environment Setup

1. Configure AWS credentials for `otopic-dev` profile
2. Set up environment variables
3. Run database migrations with Prisma
4. Start development server

## File Naming Conventions

- **Kebab-case**: Folder names use hyphens (e.g., `user-data`, `theme-day`)
- **Camel-case**: File names use camelCase (e.g., `createApp.ts`, `getAccount.ts`)
- **Descriptive**: File names describe their primary function
- **Consistent**: Similar operations follow consistent naming patterns

## Best Practices

1. **Separation of Concerns**: Clear boundaries between layers
2. **Single Responsibility**: Each file has a focused purpose
3. **Dependency Injection**: Services are injected rather than imported directly
4. **Error Handling**: Centralized error processing with proper HTTP status codes
5. **Type Safety**: Full TypeScript coverage with strict type checking
6. **Testing**: Comprehensive test coverage with both unit and integration tests
7. **Documentation**: OpenAPI specification for API documentation
8. **Security**: Input validation, authentication, and authorization middleware
