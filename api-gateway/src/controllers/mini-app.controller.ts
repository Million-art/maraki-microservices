import { All, Controller, Req, Res, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../shared/logs/logger.service';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Controller('v1/mini-app')
@ApiTags('mini-app')
export class MiniAppController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  @All()
  async proxy(@Req() req: Request, @Res() res: Response) {
    const miniAppServiceUrl = this.configService.get<string>('MINI_APP_SERVICE_URL');
    const targetUrl = `${miniAppServiceUrl}${req.url.replace('/v1', '')}`;

    try {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.request({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: req.headers,
      }),
    );

    res.status(response.status).send(response.data);
  } catch (error: any) {
    this.logger.error('Proxy error', error.message);
    throw new BadGatewayException(error.response?.data || 'Proxy error');
  }
  }
}
