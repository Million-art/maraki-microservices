import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateQuizRequest } from '../../interfaces/create-quiz.interface';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class CreateQuizUseCase {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: CreateQuizRequest): Promise<QuizEntity> {
    // Create a new domain entity
    const newQuiz = QuizEntity.create(
      request.title,
      request.duration,
      request.totalQuestions,
      request.passingScore,
      request.questions,
      request.difficulty,
      request.description,
      request.category,
    );

    // Save quiz to Admin database
    const savedQuiz = await this.quizRepository.save(newQuiz);

    // Publish quiz created event via NATS
    try {
      await firstValueFrom(
        this.natsClient.emit('quiz.created', {
          quizId: savedQuiz.id,
          title: savedQuiz.title,
          category: savedQuiz.category,
        }),
      );
      this.loggerService.log(`✅ Quiz created event published: ${savedQuiz.id}`, 'CreateQuizUseCase');
    } catch (err) {
      console.error('❌ Failed to publish quiz created event:', err.message);
      this.loggerService.error(`❌ Failed to publish quiz created event: ${err.message}`, err.stack, 'CreateQuizUseCase');
    }

    // Return saved quiz
    return savedQuiz;
  }
}
