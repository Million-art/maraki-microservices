import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class DeleteQuizUseCase {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(id: string): Promise<void> {
    // Check if quiz exists
    const existingQuiz = await this.quizRepository.findById(id);
    if (!existingQuiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    // Soft delete quiz from database
    await this.quizRepository.softDelete(id);

    // Publish quiz deleted event via NATS
    try {
      await firstValueFrom(
        this.natsClient.emit('quiz.deleted', {
          quizId: id,
          title: existingQuiz.title,
        }),
      );
      this.loggerService.log(`✅ Quiz deleted event published: ${id}`, 'DeleteQuizUseCase');
    } catch (err) {
      console.error('❌ Failed to publish quiz deleted event:', err.message);
      this.loggerService.error(`❌ Failed to publish quiz deleted event: ${err.message}`, err.stack, 'DeleteQuizUseCase');
    }
  }
}
