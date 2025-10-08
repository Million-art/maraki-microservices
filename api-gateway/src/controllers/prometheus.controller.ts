import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '../shared/metrics/metrics.service';

@Controller()
export class PrometheusController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
