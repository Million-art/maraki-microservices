# NestJS Backend with Hexagonal Architecture and DDD

This project demonstrates a NestJS backend application refactored to implement Domain-Driven Design (DDD) principles within a Hexagonal Architecture (Ports and Adapters) pattern. The focus is on separating core business logic from external concerns like databases and HTTP handling.

 
1. **Layer Separation**: Organized code into Domain (core business), Application (use cases), Infrastructure (external adapters), Presentation (HTTP layer), and Shared (cross-cutting concerns).

2. **Dependency Injection Fixes**: Added `@Injectable()` decorators to all use case classes (e.g., `GetAllUsersUseCase`, `CreateUserUseCase`) to enable proper NestJS dependency injection, resolving runtime errors like "Cannot read properties of undefined (reading 'findAll')".

3. **Entity Configuration**: Added `@Entity()` decorator to `UserModel` in the infrastructure layer for TypeORM metadata recognition.

4. **Import Path Corrections**: Fixed relative import paths (e.g., in `user.model.ts` and `infrastructure.module.ts`) to resolve module resolution errors in tests.

5. **Test Environment Setup**: 
   - Created `test/setup.ts` to set environment variables (e.g., `NODE_ENV=development`, database config).
   - Updated `test/jest-e2e.json` with globals and setup files.
   - Modified `app.e2e-spec.ts` to match application configuration (global prefix `/api`, URI versioning `v1`, validation pipes) and target correct endpoints (e.g., `GET /api/v1/users`).
   - Configured TypeORM in `app.module.ts` to use SQLite for tests when `NODE_ENV='test'`.

6. **Database Configuration**: Ensured TypeORM uses PostgreSQL in development/production and SQLite in tests, with validation for `NODE_ENV`.

These changes resolved runtime errors, test failures (e.g., 404 on wrong endpoints, validation errors), and ensured the architecture supports DDD by keeping the domain layer pure and technology-agnostic.

## DDD and Hexagonal Architecture Explanation

### Domain-Driven Design (DDD)
DDD emphasizes modeling software around the business domain:
- **Entities**: Rich objects with identity and behavior (e.g., `UserEntity` in domain/entities).
- **Ports**: Abstract interfaces defining domain needs (e.g., `UserRepository` in domain/port).
- **Bounded Contexts**: The user management is a single context; future features can add more.

### Hexagonal Architecture (Ports and Adapters)
The core domain is isolated; external systems adapt to it via ports:
- **Domain Layer**: Pure business rules, no external dependencies.
- **Application Layer**: Coordinates domain objects for use cases.
- **Infrastructure Layer**: Adapters for persistence (TypeORM repositories), external services.
- **Presentation Layer**: Adapters for HTTP (controllers, DTOs).
- Dependencies flow inward: Presentation and Infrastructure depend on Domain via ports.

This setup allows swapping databases or adding message queues without changing business logic.
 