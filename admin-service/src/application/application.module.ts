import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/users/create-user.usecase';
import { GetUserUseCase } from './use-cases/users/get-user-usecase';
import { GetAllUsersUseCase } from './use-cases/users/get-all-users-usecase';
import { DeleteUserUseCase } from './use-cases/users/delete-user.usecase';
import { UpdateUserUseCase } from './use-cases/users/update-user-usecase';
import { CreateQuizUseCase } from './use-cases/quize/create-quiz.usecase';
import { GetQuizUseCase } from './use-cases/quize/get-quiz.usecase';
import { GetAllQuizzesUseCase } from './use-cases/quize/get-all-quizzes-usecase';
import { DeleteQuizUseCase } from './use-cases/quize/delete-quiz.usecase';
import { UpdateQuizUseCase } from './use-cases/quize/update-quiz.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { natsClient } from '../nats-client/nats-client.module';
import { SharedModule } from '../shared/shared.module';
 
@Module({
  imports: [natsClient,InfrastructureModule,SharedModule],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    CreateQuizUseCase,
    GetQuizUseCase,
    GetAllQuizzesUseCase,
    DeleteQuizUseCase,
    UpdateQuizUseCase,
    
  ],
  exports: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    CreateQuizUseCase,
    GetQuizUseCase,
    GetAllQuizzesUseCase,
    DeleteQuizUseCase,
    UpdateQuizUseCase,
  ],
})
export class ApplicationModule {}
