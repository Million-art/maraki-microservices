import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { UserRepositoryImpl } from './repository/user.repository';
import { UserRepository } from '../domain/port/user.repository';
import { EmailService } from './services/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    EmailService,
  ],
  exports: [UserRepository, TypeOrmModule, EmailService],
})
export class InfrastructureModule {}
