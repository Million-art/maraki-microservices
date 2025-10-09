import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getAggregatedSwagger } from '../swagger-aggregator';

@Controller()
export class SwaggerController {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  @Get('docs-json')
  async getAggregatedSwaggerJson() {
    return await getAggregatedSwagger(this.httpService, this.config);
  }
}
