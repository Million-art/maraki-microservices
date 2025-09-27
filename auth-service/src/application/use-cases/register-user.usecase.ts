import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/port/user.repository';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, email: string): Promise<void> {
    const user = UserEntity.create(id, email);
    await this.userRepository.save(user);
  }
}
