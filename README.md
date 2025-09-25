# Maraki Microservices Backend

This project is a monorepo implementing a backend for the Maraki application using NestJS, structured as multiple microservices following Domain-Driven Design (DDD) principles and Hexagonal Architecture (Ports and Adapters). 
## Architecture Overview

The architecture separates concerns into layers to keep the core business logic (Domain) independent of external technologies:

- **Domain Layer**: Core business entities, interfaces (ports), and domain services. Pure and technology-agnostic (e.g., `UserEntity`, `UserRepository` interface).
- **Application Layer**: Use cases orchestrating domain logic (e.g., `CreateUserUseCase`, `GetAllUsersUseCase`).
- **Infrastructure Layer**: Adapters for external systems like databases (TypeORM with PostgreSQL/SQLite), monitoring (health checks).
- **Presentation Layer**: HTTP controllers, DTOs, and mappers for API exposure (e.g., `UserController`, `CreateUserDto`).
- **Shared Layer**:  concerns like exceptions, guards, and modules.

Dependencies flow inward: Outer layers (Presentation, Infrastructure) depend on inner layers (Application, Domain) via ports, enabling easy swapping of databases or APIs without altering business rules.

This setup supports DDD by modeling around bounded contexts (e.g., user management in admin-service, authentication in auth-service).

## Services

- **admin-service**: Handles user management (CRUD operations). Includes user entities, repositories, use cases, and API endpoints (e.g., `/api/v1/users`).
- **auth-service**: Manages authentication and authorization. Includes guards, tokens, and related domain logic.
- **mini-app-service**: Core application service for mini-app features, integrating with other services.

Each service has its own `package.json`, TypeScript config, and tests.

## Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (for development/production)  
- Git
- Optional: Docker for containerization

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Million-art/maraki-microservices.git
   cd maraki-microservices/services/backend
   ```

2. Install dependencies for each service (no root-level deps; each service is independent):
   ```
   cd admin-service && npm install && cd ../
   cd auth-service && npm install && cd ../
   cd mini-app-service && npm install && cd ../
   ```

3. Set up environment variables (create `.env` in each service root):
   ```
   NODE_ENV=development
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=maraki_db
   ```
   For tests, set `NODE_ENV=test` to use SQLite.

4. Database setup: Run migrations or initialize DB schema per service (if using TypeORM, configure in `app.module.ts`).

## Running the Services

Each service runs independently on default port 3000 (configurable via env).

- **Admin Service**:
  ```
  cd admin-service
  npm run start:dev
  ```
  Access: http://localhost:3000/api/v1/users

- **Auth Service**:
  ```
  cd auth-service
  npm run start:dev
  ```
  Access: http://localhost:3000 (endpoints for login/register)

- **Mini-App Service**:
  ```
  cd mini-app-service
  npm run start:dev
  ```
  Access: http://localhost:3000 (core app endpoints)

To run all services simultaneously, use multiple terminals or a process manager like `concurrently` (install globally: `npm i -g concurrently`), then:
```
concurrently "cd admin-service && npm run start:dev" "cd auth-service && npm run start:dev" "cd mini-app-service && npm run start:dev"
```

## Testing

Each service has e2e tests using Jest.

- Run tests for a service:
  ```
  cd admin-service
  npm run test:e2e
  ```

- Tests use SQLite by default and cover endpoints with validation (global prefix `/api`, version `v1`).

## Deployment

- **Docker**: Create `Dockerfile` per service (example for admin-service):
  ```
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  CMD ["npm", "run", "start:prod"]
  ```
  Build and run: `docker build -t admin-service . && docker run -p 3000:3000 -e NODE_ENV=production admin-service`

- **Cloud**: Deploy to platforms like Heroku, AWS, or Vercel. Use PM2 for process management. Ensure inter-service communication (e.g., via HTTP/gRPC).

- For production, use PostgreSQL and set secure env vars (JWT secrets, DB creds).

## Contribution

- Fork the repo and create a feature branch: `git checkout -b feature/new-endpoint`
- Commit changes: `git commit -m "Add new user endpoint"`
- Push: `git push origin feature/new-endpoint`
- Open a Pull Request to `master`.

Linting: Uses ESLint and Prettier (configs in each service).

## Troubleshooting

- **Dependency Injection Errors**: Ensure `@Injectable()` on use cases/services.
- **DB Connection**: Verify env vars and DB running.
- **Tests Failing**: Check `NODE_ENV=test` and SQLite path.
- **Port Conflicts**: Change `PORT` env var per service.

 