import { Injectable } from '@nestjs/common';
import { EmailService } from '../../infrastructure/services/email.service';
import { LoggerService } from '../../shared/logs/logger.service';
import { randomBytes } from 'crypto';
import { SendInviteRequest, SendInviteResponse } from '../interfaces/send-invite.interface';

@Injectable()
export class SendInviteUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: SendInviteRequest): Promise<SendInviteResponse> {
    try {
      this.loggerService.log(`Sending invite email to ${request.email}`, 'SendInviteUseCase');

      const token = this.generateToken();
      const inviteLink = `${process.env.INVITE_URL}/auth/set-password?token=${token}`;

      await this.emailService.sendInviteEmail({
        to: request.email,
        inviteLink,
        expiryHours: 24,
      });

      this.loggerService.log(`Invite email sent successfully to ${request.email}`, 'SendInviteUseCase');

      return { success: true, token };
    } catch (error) {
      this.loggerService.error(`Failed to send invite email to ${request.email}: ${error.message}`, error.stack, 'SendInviteUseCase');
      return { success: false, error: error.message };
    }
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }
}
