import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { UserRepositoryImpl } from './repository/user.repository';
import { UserRepository } from '../domain/port/user.repository';
import { EmailService } from './services/email.service';
import { JetStreamProvider } from './nats/jetstream.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    EmailService,
    JetStreamProvider
  ],
  exports: [UserRepository, TypeOrmModule, EmailService, JetStreamProvider],
})
export class InfrastructureModule {}
