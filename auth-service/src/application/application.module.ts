import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SharedModule } from '../shared/shared.module';
import { SetPasswordUseCase } from './use-cases/set-password.usecase';
import { LoginUseCase } from './use-cases/login-user.usecase';
import { SendInviteUseCase } from './use-cases/send-invite.usecase';
import { UserRegistrationUseCase } from './use-cases/process-registration.usecase';

@Module({
  imports: [InfrastructureModule, SharedModule],
  providers: [
    SetPasswordUseCase,
    LoginUseCase,
    SendInviteUseCase,
    UserRegistrationUseCase
  ],
  exports: [
    SetPasswordUseCase,
    LoginUseCase,
    SendInviteUseCase,
    UserRegistrationUseCase
  ],
})
export class ApplicationModule {}
