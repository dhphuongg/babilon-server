# Babilon Server

A NestJS-based API implementing Domain-Driven Design (DDD) and CQRS patterns.

## I. Features

- 🏗️ DDD and CQRS architecture
- 🔒 Authentication system
- 🚀 REST API with standardized responses
- 🐳 Docker containerization
- ⚡ Type-safe configurations
- 📝 Comprehensive logging
- 🛡️ Exception handling
- 🧪 Testing setup
- 🔄 CI/CD with GitHub Actions
- 🚀 Automated deployment

## II. Prerequisites

- Node.js v20 or higher
- pnpm package manager
- Docker and Docker Compose (for containerized deployment)

## III. Installation

```bash
# Install dependencies
pnpm install
```

## IV. Running the project

### Development

```bash
# Start development server with hot-reload
pnpm start:dev

# Start with debugger
pnpm start:debug
```

### Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start:prod
```

### Docker

```bash
# Build and start containers
docker-compose up -d

# Stop containers
docker-compose down
```

## V. Development

### Project Structure

```
src/
├── application/         # Application layer (CQRS commands/queries)
│   ├── commands/       # Command handlers and implementations
│   ├── events/        # Domain events
│   └── queries/       # Query handlers and implementations
├── domain/             # Domain layer (core business logic)
│   ├── constants/     # Domain constants (mail templates, etc.)
│   ├── interfaces/    # Domain interfaces
│   └── repositories/  # Repository interfaces
├── infrastructure/     # Infrastructure layer (config, external services)
│   ├── auth/         # Authentication module
│   ├── common/       # Common decorators, guards, filters
│   ├── config/       # Environment configuration
│   ├── mail/         # Email service implementation
│   ├── prisma/       # Database ORM configuration
│   ├── providers/    # Repository providers
│   ├── repositories/ # Repository implementations
│   └── templates/    # Email templates (EJS)
└── presentation/      # Presentation layer
    ├── controllers/  # API controllers
    └── dtos/        # Data Transfer Objects
```

## VI. Docker Support

The application is containerized using Docker with a multi-stage build process for optimal production images.

## VII. CI/CD

The project uses GitHub Actions for continuous integration and continuous deployment.

### Workflow Features:

- Automated testing on push and pull requests
- ESLint code quality checks
- Unit and E2E test execution
- Docker image building and publishing
- Automatic deployment to production server
- Cache optimization for faster builds

### Required GitHub Secrets:

```bash
# Docker Hub Authentication
DOCKER_USERNAME    # Docker Hub username
DOCKER_PASSWORD    # Docker Hub access token

# Production Server Access
SERVER_HOST       # Production server IP address
SERVER_USERNAME   # SSH username
SERVER_PASSWORD   # SSH password
```

## VIII. Contributing

1. Follow the established architecture (DDD and CQRS)
2. Write tests for new features
3. Follow TypeScript best practices
4. Use provided interceptors for consistent responses
5. Handle exceptions using the global filter
6. Document new endpoints and features
7. Ensure CI pipeline passes before submitting PRs
8. Test deployment in a staging environment first
