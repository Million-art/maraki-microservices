import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';

@Controller()
export class UserCreatedSubscriber {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: { id: string; email: string }) {
    await this.registerUserUseCase.execute(data.id, data.email);
  }
}
