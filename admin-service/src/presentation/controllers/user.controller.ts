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
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users-usecase';
import { GetUserUseCase } from '../../application/use-cases/get-user-usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user-usecase';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../dto/mappers/user.mapper';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('admin')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return UserMapper.toResponseDto(user);
  }

  @Get()
  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return UserMapper.toResponseDtoList(users);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    if (!user) {
      // Throw 404 if user not found
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return UserMapper.toResponseDto(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute({ id, ...dto });
    return UserMapper.toResponseDto(user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
