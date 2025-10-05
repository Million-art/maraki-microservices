import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendInviteUseCase } from '../../application/use-cases/send-invite.usecase';
import { LoggerService } from '../../shared/logs/logger.service';
import type { SendInviteRequest } from '../../application/interfaces/send-invite.interface';

@Controller()
export class UserMicroserviceController {
  constructor(
    private readonly sendInviteUseCase: SendInviteUseCase,
    private readonly loggerService: LoggerService,
  ) {}

  @MessagePattern('auth.createUser')
  async handleCreateUser(@Payload() data: SendInviteRequest) {
    this.loggerService.log(`📩 Received auth.createUser message for email: ${data.email}`, 'UserMicroserviceController');

    const result = await this.sendInviteUseCase.execute(data);

    if (result.success) {
      this.loggerService.log(`✅ Invite sent successfully for ${data.email}`, 'UserMicroserviceController');
    } else {
      this.loggerService.error(`❌ Failed to send invite for ${data.email}: ${result.error}`, undefined, 'UserMicroserviceController');
    }

    return result;
  }
}
