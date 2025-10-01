import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/port/user.repository';
import { SetPasswordRequest } from '../interfaces/set-password.interface';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/shared/logs/logger.service';

@Injectable()
export class SetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: SetPasswordRequest): Promise<void> {
    const user = await this.userRepository.findByInviteToken(request.token);
    if (!user) {
      this.loggerService.warn(`Set password failed: Invalid token ${request.token}`, 'SetPasswordUseCase');
      throw new NotFoundException('Invalid token');
    }
    if (user.isTokenExpired()) {
      this.loggerService.warn(`Set password failed: Token expired for user ${user.email}`, 'SetPasswordUseCase');
      throw new BadRequestException('Token expired');
    }
    const passwordHash = await bcrypt.hash(request.password, 10);
    await this.userRepository.updatePassword(user.id, passwordHash);
    this.loggerService.log(`Password set for user ${user.email}`, 'SetPasswordUseCase');
  }
}
