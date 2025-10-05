import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AuthController } from './controllers/auth.controller';
import { UserMicroserviceController } from './controllers/user-microservice.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [ApplicationModule,SharedModule],
  controllers: [AuthController, UserMicroserviceController],
  providers: [],
  exports: []
})
export class PresentationModule {}
