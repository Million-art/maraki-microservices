import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { QuizController } from './controllers/quiz.controller';
import { ApplicationModule } from '../application/application.module';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports:[ApplicationModule,SharedModule],
    controllers:[UserController, QuizController]
})
export class PresentationModule {}
