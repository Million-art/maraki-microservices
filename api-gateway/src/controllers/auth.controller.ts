import { Controller, Req, Res, Post, Query, Body, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
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

  private async proxyRequest(req: Request, res: Response) {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    const targetUrl = `${authServiceUrl}${req.url}`;

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

  @Post('set-password')
  @ApiOperation({ summary: 'Set password for user' })
  @ApiQuery({ name: 'token', description: 'Reset token' })
  @ApiResponse({ status: 200, description: 'Password set successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async setPassword(@Query('token') token: string, @Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful, returns token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  async login(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  @Post('resend-invite')
  @ApiOperation({ summary: 'Resend invite' })
  @ApiResponse({ status: 200, description: 'Invite resent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  async resendInvite(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }
}
