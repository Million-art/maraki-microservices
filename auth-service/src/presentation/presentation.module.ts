import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthController } from './controllers/auth.controller';
import { UserMicroserviceController } from './controllers/user-microservice.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [ApplicationModule, InfrastructureModule, SharedModule],
  controllers: [AuthController, UserMicroserviceController],
  providers: [],
  exports: []
})
export class PresentationModule {}
