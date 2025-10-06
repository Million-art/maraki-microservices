import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/port/user.repository";
import { EmailService } from "../../infrastructure/services/email.service";
import { LoggerService } from "../../shared/logs/logger.service";
import { userRequest } from "../interfaces/user-request.interface";
import { UserEntity } from "../../domain/entities/user.entity";

@Injectable()
export class UserRegistrationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: userRequest): Promise<void> {
    let user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      if (request.id) {
        // Create user in auth-service (from NATS)
        const newUser = new UserEntity(
          request.id as string,
          request.email,
        );
        user = await this.userRepository.save(newUser);
        this.loggerService.log(`Created user in auth-service: ${request.email}`, 'UserRegistrationUseCase');
      } else {
        // For resend, user must exist
        throw new Error('User not found');
      }
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userRepository.updateInviteToken(user.id, token, expiry);
    const inviteLink = `${process.env.Invite_Url}/auth/set-password?token=${token}`;
    await this.emailService.sendInviteEmail({ to: request.email, inviteLink, expiryHours: 24 });
    this.loggerService.log(`Invite sent to ${request.email}`, 'UserRegistrationUseCase');
  }
}
