import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export async function getAggregatedSwagger(httpService: HttpService, config: ConfigService) {
  const authUrl = config.get('AUTH_SERVICE_URL');
  const adminUrl = config.get('ADMIN_SERVICE_URL');
  const miniAppUrl = config.get('MINI_APP_SERVICE_URL');

  const services = [
    { name: 'auth', url: `${authUrl}/docs-json`, prefixReplace: /^\/auth/, prefixWith: '/api/v1/auth' },
    { name: 'admin', url: `${adminUrl}/docs-json`, prefixReplace: /^\/users/, prefixWith: '/api/v1/admin/users' },
    { name: 'mini-app', url: `${miniAppUrl}/docs-json`, prefixReplace: /^\/mini-app/, prefixWith: '/api/v1/mini-app' },
  ];

  const aggregated = {
    openapi: '3.0.0',
    info: {
      title: 'Maraki API Documentation',
      version: '1.0.0',
    },
    paths: {},
    components: { schemas: {} },
    tags: [
      { name: 'admin', description: 'Admin service endpoints' },
      { name: 'auth', description: 'Authentication service endpoints' },
      { name: 'mini-app', description: 'Mini App service endpoints' },
    ],
  };

  for (const service of services) {
    try {
      const response = await firstValueFrom(httpService.get(service.url));
      const swagger = response.data;

      // Merge paths
      for (const [path, methods] of Object.entries(swagger.paths || {})) {
        let newPath = path;
        if (service.prefixReplace && service.prefixWith) {
          newPath = path.replace(service.prefixReplace, service.prefixWith);
        } else {
          newPath = `/api${path}`;
        }
        aggregated.paths[newPath] = methods;
      }

      // Merge schemas
      if (swagger.components?.schemas) {
        Object.assign(aggregated.components.schemas, swagger.components.schemas);
      }
    } catch (error) {
      console.warn(`Failed to fetch swagger from ${service.name}:`, error.message);
    }
  }

  return aggregated;
}
