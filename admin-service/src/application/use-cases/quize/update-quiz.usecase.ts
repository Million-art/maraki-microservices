import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UpdateQuizRequest } from '../../interfaces/update-quiz.interface';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class UpdateQuizUseCase {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: UpdateQuizRequest): Promise<QuizEntity> {
    // Check if quiz exists
    const existingQuiz = await this.quizRepository.findById(request.id);
    if (!existingQuiz) {
      throw new NotFoundException(`Quiz with id ${request.id} not found`);
    }

    // Update the quiz entity
    const updatedQuiz = existingQuiz.updateQuiz(
      request.title,
      request.description,
      request.duration,
      request.totalQuestions,
      request.passingScore,
      request.questions,
      request.category,
      request.difficulty,
    );

    // Save updated quiz to database
    const savedQuiz = await this.quizRepository.save(updatedQuiz);

    // Publish quiz updated event via NATS
    try {
      await firstValueFrom(
        this.natsClient.emit('quiz.updated', {
          quizId: savedQuiz.id,
          title: savedQuiz.title,
          category: savedQuiz.category,
        }),
      );
      this.loggerService.log(`✅ Quiz updated event published: ${savedQuiz.id}`, 'UpdateQuizUseCase');
    } catch (err) {
      console.error('❌ Failed to publish quiz updated event:', err.message);
      this.loggerService.error(`❌ Failed to publish quiz updated event: ${err.message}`, err.stack, 'UpdateQuizUseCase');
    }

    return savedQuiz;
  }
}
