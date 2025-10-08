import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HttpHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('auth-service', this.config.get('AUTH_SERVICE_URL') + '/health'),
      () => this.http.pingCheck('admin-service', this.config.get('ADMIN_SERVICE_URL') + '/health'),
      () => this.http.pingCheck('mini-app-service', this.config.get('MINI_APP_SERVICE_URL') + '/health'),
       
    ]);
  }
}
