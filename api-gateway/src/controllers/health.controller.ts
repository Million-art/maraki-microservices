import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HttpHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  checkRoot() {
    return this.health.check([
      () => this.http.pingCheck('auth-service', this.config.get('AUTH_SERVICE_URL') + '/health'),
      () => this.http.pingCheck('admin-service', this.config.get('ADMIN_SERVICE_URL') + '/health'),
      () => this.http.pingCheck('mini-app-service', this.config.get('MINI_APP_SERVICE_URL') + '/health'),
    ]);
  }

  @Get('health')
  checkHealth() {
    console.log('Health endpoint called');
    return { 
      status: 'ok', 
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      message: 'API Gateway is running'
    };
  }

  @Get('test')
  testEndpoint() {
    console.log('Test endpoint called');
    return { 
      message: 'Test endpoint is working',
      timestamp: new Date().toISOString()
    };
  }
}
