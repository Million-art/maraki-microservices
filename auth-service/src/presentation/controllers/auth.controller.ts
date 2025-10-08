import { Controller, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.usecase';
import { LoginUseCase } from '../../application/use-cases/login-user.usecase';
import { SetPasswordDto } from '../dto/set-password.dto';
import { LoginDto } from '../dto/login.dto';
import { ResendInviteDto } from '../dto/resend-invite.dto';
import { AuthMapper } from '../dto/mappers/auth.mapper';
import { UserRegistrationUseCase } from '../../application/use-cases/process-registration.usecase';
import { UserRepository } from '../../domain/port/user.repository';
import { IncomingRequest } from '../../application/interfaces/user.interface';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly setPasswordUseCase: SetPasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly resendInviteUseCase: UserRegistrationUseCase,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set user password using token' })
  @ApiBody({ type: SetPasswordDto })
  @ApiQuery({ name: 'token', type: String, required: true, description: 'Password reset token' })
  @ApiResponse({ status: 200, description: 'Password set successfully', schema: { example: { message: 'Password set successfully' } } })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async setPassword(@Body() dto: SetPasswordDto, @Query('token') token: string): Promise<{ message: string }> {
    const request = AuthMapper.toSetPasswordRequest(dto, token);
    await this.setPasswordUseCase.execute(request);
    return { message: 'Password set successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'JWT token returned', schema: { example: { token: 'jwt-token-string' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() dto: LoginDto): Promise<{ token: string }> {
    const request = AuthMapper.toLoginRequest(dto);
    const token = await this.loginUseCase.execute(request);
    return { token };
  }

  @Post('resend-invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend invite email to user' })
  @ApiBody({ type: ResendInviteDto })
  @ApiResponse({ status: 200, description: 'Invite resent successfully', schema: { example: { message: 'Invite resent successfully' } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resendInvite(@Body() dto: ResendInviteDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('User not found');
    }
    const request: IncomingRequest = {
      id: user.id,
      email: user.email,
      role: user.roles[0] || 'user',
    };
    await this.resendInviteUseCase.execute(request);
    return { message: 'Invite resent successfully' };
  }
}
