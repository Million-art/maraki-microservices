import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { QuizModel } from './models/quiz.model';
import { UserRepository } from '../domain/ports/user.repository';
import { QuizRepository } from '../domain/ports/quiz.repository';
import { UserRepositoryImpl } from './repository/user.repository';
import { QuizRepositoryImpl } from './repository/quiz.repository';
import { JetStreamProvider } from './nats/jetstream.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, QuizModel])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: QuizRepository,
      useClass: QuizRepositoryImpl,
    },
    JetStreamProvider,
    
  ],
  exports: [UserRepository, QuizRepository, JetStreamProvider],
})
export class InfrastructureModule {}
