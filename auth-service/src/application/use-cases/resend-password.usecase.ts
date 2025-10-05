
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/port/user.repository';
import { EmailService } from '../../infrastructure/services/email.service';
import { ResendInviteRequest } from '../interfaces/resend-invite.interface';
import { LoggerService } from '../../shared/logs/logger.service';

@Injectable()
export class ResendInviteUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: ResendInviteRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      this.loggerService.warn(`Resend invite failed: User not found for email ${request.email}`, 'ResendInviteUseCase');
      throw new NotFoundException('User not found');
    }
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userRepository.updateInviteToken(user.id, token, expiry);
    const inviteLink = `http://localhost:3001/auth/set-password?token=${token}`;
    await this.emailService.sendInviteEmail({ to: request.email, inviteLink, expiryHours: 24 });
    this.loggerService.log(`Invite resent to ${request.email}`, 'ResendInviteUseCase');
  }
}
