import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RegisterUserUseCase } from './use-cases/register-user.usecase';
import { SetPasswordUseCase } from './use-cases/set-password.usecase';
import { LoginUseCase } from './use-cases/login-user.usecase';
import { ResendInviteUseCase } from './use-cases/resend-password.usecase';
import { UserRepository } from 'src/domain/port/user.repository';

@Module({
  imports: [InfrastructureModule],
  providers: [
    RegisterUserUseCase,
    SetPasswordUseCase,
    LoginUseCase,
    ResendInviteUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    SetPasswordUseCase,
    LoginUseCase,
    ResendInviteUseCase,
  ],
})
export class ApplicationModule {}
