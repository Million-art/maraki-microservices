import { Injectable, ConflictException } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/user.repository';
import { CreateUserRequest } from '../interfaces/create-user.interface';
import { JetStreamProvider } from 'src/infrastructure/nats/jetstream.provider';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jetStream: JetStreamProvider
   ) {}

  async execute(request: CreateUserRequest): Promise<UserEntity> {
    // Check if user already exists and is active
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
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
    const js = this.jetStream.getJetStream()
    const sc = this.jetStream.getCodec()
    await js.publish(
      'user.created',
      sc.encode(JSON.stringify({email:request.email}))
    )
    // Return the saved user
    return savedUser;
  }
}
