import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateQuizUseCase } from '../../application/use-cases/quize/create-quiz.usecase';
import { GetAllQuizzesUseCase } from '../../application/use-cases/quize/get-all-quizzes-usecase';
import { GetQuizUseCase } from '../../application/use-cases/quize/get-quiz.usecase';
import { UpdateQuizUseCase } from '../../application/use-cases/quize/update-quiz.usecase';
import { DeleteQuizUseCase } from '../../application/use-cases/quize/delete-quiz.usecase';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { QuizMapper } from '../dto/mappers/quiz.mapper';
import { QuizResponseDto } from '../dto/quiz-response.dto';

@ApiTags('admin')
@Controller('quizzes')
export class QuizController {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly getQuizUseCase: GetQuizUseCase,
    private readonly getAllQuizzesUseCase: GetAllQuizzesUseCase,
    private readonly updateQuizUseCase: UpdateQuizUseCase,
    private readonly deleteQuizUseCase: DeleteQuizUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({ status: 201, description: 'Quiz created successfully', type: QuizResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateQuizDto): Promise<QuizResponseDto> {
    const quiz = await this.createQuizUseCase.execute(dto);
    return QuizMapper.toResponseDto(quiz);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'List of quizzes', type: [QuizResponseDto] })
  async getAll(): Promise<QuizResponseDto[]> {
    const quizzes = await this.getAllQuizzesUseCase.execute();
    return QuizMapper.toResponseDtoList(quizzes);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'Quiz found', type: QuizResponseDto })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async getById(@Param('id') id: string): Promise<QuizResponseDto> {
    const quiz = await this.getQuizUseCase.execute(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    return QuizMapper.toResponseDto(quiz);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'Quiz updated successfully', type: QuizResponseDto })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuizDto,
  ): Promise<QuizResponseDto> {
    const quiz = await this.updateQuizUseCase.execute({ id, ...dto });
    return QuizMapper.toResponseDto(quiz);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteQuizUseCase.execute(id);
  }
}
