import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/port/user.repository';
import { SetPasswordRequest } from '../interfaces/set-password.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: SetPasswordRequest): Promise<void> {
    const user = await this.userRepository.findByInviteToken(request.token);
    if (!user) {
      throw new NotFoundException('Invalid token');
    }
    if (user.isTokenExpired()) {
      throw new BadRequestException('Token expired');
    }
    const passwordHash = await bcrypt.hash(request.password, 10);
    await this.userRepository.updatePassword(user.id, passwordHash);
  }
}
