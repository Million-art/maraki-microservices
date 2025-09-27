import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { UserCreatedSubscriber } from './subscribers/user-created.subscriber';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController],
  providers: [UserCreatedSubscriber],
  exports:[UserCreatedSubscriber]
})
export class PresentationModule {}
