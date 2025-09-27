import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/user.repository';
import { CreateUserRequest } from '../interfaces/create-user.interface';
import { UserCreatedEvent } from '../../domain/events/create-user.event';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

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

    // Publish user.created event
    this.natsClient.emit('user.created', new UserCreatedEvent(savedUser.id, savedUser.email));

    // Return the saved user
    return savedUser;
  }
}
