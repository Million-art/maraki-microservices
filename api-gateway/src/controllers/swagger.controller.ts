import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller()
export class SwaggerController {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}


  @Get('docs')
  async getAggregatedSwagger() {
    const authUrl = this.config.get('AUTH_SERVICE_URL');
    const adminUrl = this.config.get('ADMIN_SERVICE_URL');
    const miniAppUrl = this.config.get('MINI_APP_SERVICE_URL');

    const services = [
      { name: 'auth', url: `${authUrl}/docs-json` },
      { name: 'admin', url: `${adminUrl}/docs-json` },
      { name: 'mini-app', url: `${miniAppUrl}/docs-json` },
    ];

    const aggregated = {
      openapi: '3.0.0',
      info: {
        title: 'Maraki API Gateway - Aggregated',
        version: '1.0.0',
      },
      paths: {},
      components: { schemas: {} },
    };

    for (const service of services) {
      try {
        const response = await firstValueFrom(this.httpService.get(service.url));
        const swagger = response.data;

        // Merge paths
        for (const [path, methods] of Object.entries(swagger.paths || {})) {
          const prefixedPath = `/api/${service.name}${path}`;
          aggregated.paths[prefixedPath] = methods;
        }

        // Merge schemas
        if (swagger.components?.schemas) {
          Object.assign(aggregated.components.schemas, swagger.components.schemas);
        }
      } catch (error) {

       }
    }

    return aggregated;
  }
}
