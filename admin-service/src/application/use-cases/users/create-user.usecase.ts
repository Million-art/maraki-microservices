import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/user.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserRequest } from '../../interfaces/create-user.interface';
import { LoggerService } from '../../../shared/logs/logger.service';
 
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
   ) {}

  async execute(request: CreateUserRequest): Promise<UserEntity> {
    //  Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      this.loggerService.warn('User already exists', 'CreateUserUseCase');
      throw new ConflictException('User already exists');
    }

    //  Create a new domain entity
    const newUser = UserEntity.create(
      request.name,
      request.email,
      request.role,
    );

    //  Save user to Admin database
    const savedUser = await this.userRepository.save(newUser);

    //  Notify Auth Service to create corresponding auth record (RPC)
    try {
      const response = await firstValueFrom(
        this.natsClient.send('auth.createUser', {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
        }),
      );
      console.log('✅ Auth service response:', response);
      this.loggerService.log(`✅ Auth service response: ${JSON.stringify(response)}`, 'CreateUserUseCase');
    } catch (err) {
      console.error('❌ Auth service unavailable:', err.message);
      this.loggerService.error(`❌ Auth service unavailable: ${err.message}`, err.stack, 'CreateUserUseCase');

 
    }

    // Return saved user
    return savedUser;
  }
}
