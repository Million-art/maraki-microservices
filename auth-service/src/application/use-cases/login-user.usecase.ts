import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/port/user.repository';
import { LoginRequest } from '../interfaces/login.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoggerService } from 'src/shared/logs/logger.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService
  ) {}

  async execute(request: LoginRequest): Promise<string> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user || !user.passwordHash) {
      this.loggerService.warn(`Login failed for email: ${request.email}`, 'LoginUseCase');
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(request.password, user.passwordHash);
    if (!isValid) {
      this.loggerService.warn(`Login failed for email: ${request.email}`, 'LoginUseCase');
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
    this.loggerService.log(`User logged in: ${user.email}`, 'LoginUseCase');
    return token;
  }
}
