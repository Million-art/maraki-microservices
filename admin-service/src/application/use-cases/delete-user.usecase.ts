import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/port/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('user not found');
    }

    await this.userRepository.softDelete(id);
  }
}
