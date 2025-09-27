
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/port/user.repository';
import { EmailService } from '../../infrastructure/services/email.service';
import { ResendInviteRequest } from '../interfaces/resend-invite.interface';

@Injectable()
export class ResendInviteUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(request: ResendInviteRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userRepository.updateInviteToken(user.id, token, expiry);
    await this.emailService.sendInviteEmail(request.email, token);
  }
}
