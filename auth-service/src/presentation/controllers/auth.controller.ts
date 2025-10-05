import { Controller, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.usecase';
import { LoginUseCase } from '../../application/use-cases/login-user.usecase';
import { ResendInviteUseCase } from '../../application/use-cases/resend-password.usecase';
import { SetPasswordDto } from '../dto/set-password.dto';
import { LoginDto } from '../dto/login.dto';
import { ResendInviteDto } from '../dto/resend-invite.dto';
import { AuthMapper } from '../dto/mappers/auth.mapper';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly setPasswordUseCase: SetPasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly resendInviteUseCase: ResendInviteUseCase,
  ) {}

  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  async setPassword(@Body() dto: SetPasswordDto, @Query('token') token: string): Promise<{ message: string }> {
    const request = AuthMapper.toSetPasswordRequest(dto, token);
    await this.setPasswordUseCase.execute(request);
    return { message: 'Password set successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<{ token: string }> {
    const request = AuthMapper.toLoginRequest(dto);
    const token = await this.loginUseCase.execute(request);
    return { token };
  }

  @Post('resend-invite')
  @HttpCode(HttpStatus.OK)
  async resendInvite(@Body() dto: ResendInviteDto): Promise<{ message: string }> {
    const request = AuthMapper.toResendInviteRequest(dto);
    await this.resendInviteUseCase.execute(request);
    return { message: 'Invite resent successfully' };
  }
}
