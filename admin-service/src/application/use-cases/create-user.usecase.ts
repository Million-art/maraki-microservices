import {  Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/port/user.repository';
import { CreateUserRequest } from '../interfaces/create-user.interface';

@Injectable()
export class CreateUserUseCase {
   constructor(private readonly userRepository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<UserEntity> {
    // Check if user already exists and is active
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user with selected role
    const newUser = UserEntity.create(
      request.name,
      request.email,
      request.role,
    );

    // Save user through repository
    const savedUser = await this.userRepository.save(newUser);

    // Return the saved user
    return savedUser;
  }
}
