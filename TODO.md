# API Gateway Feature Implementation TODO

## Step 1: Install Required Dependencies ✅
- Run npm install for @nestjs/throttler @nestjs/terminus @nestjs/axios helmet pino pino-pretty @nestjs/pino cache-manager ioredis @nestjs/cache-manager opossum @opentelemetry/api @opentelemetry/sdk-trace-node @opentelemetry/auto-instrumentations-node prom-client swagger-ui-express

## Step 2: Setup Structured Logging (Pino) ✅
- Update LoggerService to use PinoLogger with pino-pretty
- Implement request context + error tracing

## Step 3: Integrate Helmet for Security Headers ✅
- Add helmet middleware in main.ts

## Step 4: Enable Global Validation + Throttling (Rate Limiting) ✅
- Add ThrottlerModule to app.module.ts with ttl: 60, limit: 30
- Set global guard for ThrottlerGuard

## Step 5: Add Health Checks using Terminus ✅
- Update HealthController to monitor Auth, Admin, MiniApp, DB, and NATS endpoints

## Step 6: Add Centralized Caching (Redis) ✅
- Run Docker Redis container
- Add CacheModule with Redis store to app.module.ts

## Step 7: Add Circuit Breaker for Service Resilience ✅
- Create circuit-breaker.ts utility
- Wrap HttpService calls with fallback + retry logic

## Step 8: Setup Prometheus Metrics + OpenTelemetry Tracing ✅
- Create metrics.service.ts with Prometheus registry
- Create tracing.ts for OpenTelemetry configuration
- Add PrometheusController for /metrics endpoint

## Step 9: Setup JWT AuthGuard ✅
- Create JWT guard to verify tokens using Auth-Service
- Attach to protected routes before proxying

## Step 10: Configure CORS Globally ✅
- Enable CORS in main.ts with origin: ['https://your-frontend-domain.com'], credentials: true

## Step 11: Setup Swagger Aggregation (Optional) ✅
- Fetch Swagger JSONs from auth, admin, miniapp services
- Merge and serve combined docs at /docs

## Step 12: Configure Environment Variables ✅
- Add REDIS_URL, PROMETHEUS_PORT, LOG_LEVEL to .env

## Step 13: Add Docker Networking Configuration ✅
- Update docker-compose.yml with maraki-net network

## Step 14: Add OpenTelemetry Auto Instrumentation
- Configure exporters in tracing.ts
- Start SDK before NestFactory in main.ts

## Step 15: Test Locally
- Run npm run start:dev
- Verify logs, health, metrics, JWT, rate limiting, caching, services, Swagger docs
