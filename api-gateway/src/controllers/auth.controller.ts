import { All, Controller, Req, Res, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../shared/logs/logger.service';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    const targetUrl = `${authServiceUrl}${req.url.replace('/api/v1/auth', '/auth')}`;
    
    try {
      const { headers: incomingHeaders } = req;
      const { host, connection, 'content-length': contentLength, 'accept-encoding': acceptEncoding, ...safeHeaders } = incomingHeaders as any;
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: targetUrl,
          data: req.body,
          headers: safeHeaders,
          validateStatus: () => true, // allow all statuses to pass through
        }),
      );

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      res.status(response.status).send(response.data);
    } catch (error: any) {
      // Only return 502 when there is no upstream response (network error/timeout)
      this.logger.error('Proxy error', error.message);
      console.error('Proxy error details:', error);
      if (error.response) {
        return res.status(error.response.status).send(error.response.data);
      }
      throw new BadGatewayException('Proxy error');
    }
  }
}
