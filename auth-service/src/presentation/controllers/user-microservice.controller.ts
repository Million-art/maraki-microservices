import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendInviteUseCase } from '../../application/use-cases/send-invite.usecase';
import { LoggerService } from '../../shared/logs/logger.service';
import type { IncomingRequest } from '../../application/interfaces/user.interface';
import { UserRegistrationUseCase } from '../../application/use-cases/process-registration.usecase';

@Controller()
export class UserMicroserviceController {
  constructor(
    private readonly sendInviteUseCase: SendInviteUseCase,
    private readonly loggerService: LoggerService,
    private readonly userRegistrationUseCase:UserRegistrationUseCase
  ) {}

  @MessagePattern('auth.createUser')
  async handleCreateUser(@Payload() data: IncomingRequest) {
    this.loggerService.log(`📩 Received auth.createUser message for email: ${data.email}`, 'UserMicroserviceController');

    const res = await this.userRegistrationUseCase.execute(data)
    const result = await this.sendInviteUseCase.execute(data);


    if (result.success) {
      this.loggerService.log(`✅ Invite sent successfully for ${data.email}`, 'UserMicroserviceController');
    } else {
      this.loggerService.error(`❌ Failed to send invite for ${data.email}: ${result.error}`, undefined, 'UserMicroserviceController');
    }

    return result;
  }
}
