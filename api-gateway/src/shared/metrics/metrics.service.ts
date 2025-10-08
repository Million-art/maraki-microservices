import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Gauge, Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Gauge<string>;

  constructor() {
    // Enable default metrics
    collectDefaultMetrics({ register });

    // Custom metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    });

    this.httpRequestDuration = new Gauge({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      registers: [register],
    });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  setHttpRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.set({ method, route }, duration);
  }

  getMetrics() {
    return register.metrics();
  }

  getRegistry() {
    return register;
  }
}
