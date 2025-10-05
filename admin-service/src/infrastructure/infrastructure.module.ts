import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { UserRepository } from '../domain/ports/user.repository';
import { UserRepositoryImpl } from './repository/user.repository';
import { JetStreamProvider } from './nats/jetstream.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    JetStreamProvider,
    
  ],
  exports: [UserRepository, JetStreamProvider],
})
export class InfrastructureModule {}
