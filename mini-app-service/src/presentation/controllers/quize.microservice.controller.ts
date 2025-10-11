import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LoggerService } from 'src/shared/logs/logger.service';

@Controller()
export class QuizController {
  constructor(
    private readonly logger: LoggerService,
  ) {}

  @EventPattern('quiz.created')
  handleQuizCreated(@Payload() data: any) {
    this.logger.log(`🎯 Quiz event received: ${JSON.stringify(data)}`);
  }
}
