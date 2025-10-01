import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SharedModule } from '../shared/shared.module';
import { SetPasswordUseCase } from './use-cases/set-password.usecase';
import { LoginUseCase } from './use-cases/login-user.usecase';
import { ResendInviteUseCase } from './use-cases/resend-password.usecase';

@Module({
  imports: [InfrastructureModule, SharedModule],
  providers: [
    SetPasswordUseCase,
    LoginUseCase,
    ResendInviteUseCase,
  ],
  exports: [
    SetPasswordUseCase,
    LoginUseCase,
    ResendInviteUseCase,
  ],
})
export class ApplicationModule {}
