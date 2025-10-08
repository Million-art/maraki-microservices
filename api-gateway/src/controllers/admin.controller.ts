import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoggerService } from '../shared/logs/logger.service';
import { AxiosResponse } from 'axios';
import { firstValueFrom, timeout, retry, catchError, throwError } from 'rxjs';
import type { Request, Response } from 'express';
import { JwtGuard } from '../shared/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('v1/admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async proxyRequest(req: Request, res: Response) {
    const adminServiceUrl = this.configService.get<string>('ADMIN_SERVICE_URL');
    const targetUrl = `${adminServiceUrl}${req.url.replace('/v1', '')}`;
    const start = Date.now();

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: targetUrl,
          data: req.body,
          headers: req.headers,
        }).pipe(
          timeout(5000),
          retry(2),
          catchError((err) => throwError(() => err)),
        ),
      );

      const responseTime = Date.now() - start;
      this.logger.logRequest(req.method, targetUrl, response.status, responseTime, 'AdminController');

      res.status(response.status).send(response.data);
    } catch (error: any) {
      this.logger.error('Proxy error', error.message, 'AdminController');
      throw new BadGatewayException(error.response?.data || 'Proxy error');
    }
  }

  @Post('users')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addUser(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }
}
