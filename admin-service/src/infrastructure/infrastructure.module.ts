import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { UserRepository } from '../domain/port/user.repository';
import { UserRepositoryImpl } from './repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserRepository],
})
export class InfrastructureModule {}
