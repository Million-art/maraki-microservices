import { All, Controller, Req, Res, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../shared/logs/logger.service';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Controller('mini-app')
@ApiTags('mini-app')
export class MiniAppController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const miniAppServiceUrl = this.configService.get<string>('MINI_APP_SERVICE_URL');
    const targetUrl = `${miniAppServiceUrl}${req.url.replace('/api/v1/mini-app', '/mini-app')}`;

    try {
    const { headers: incomingHeaders } = req;
    const { host, connection, 'content-length': contentLength, 'accept-encoding': acceptEncoding, ...safeHeaders } = incomingHeaders as any;
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.request({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: safeHeaders,
        validateStatus: () => true,
      }),
    );

    res.status(response.status).send(response.data);
  } catch (error: any) {
    this.logger.error('Proxy error', error.message);
    if (error.response) {
      return res.status(error.response.status).send(error.response.data);
    }
    throw new BadGatewayException('Proxy error');
  }
  }
}
