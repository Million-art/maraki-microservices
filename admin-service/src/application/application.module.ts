import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { GetUserUseCase } from './use-cases/get-user-usecase';
import { GetAllUsersUseCase } from './use-cases/get-all-users-usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user-usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
 
@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    
  ],
  exports: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
  ],
})
export class ApplicationModule {}
