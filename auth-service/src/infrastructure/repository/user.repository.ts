import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/port/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModelRepository: Repository<UserModel>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
  
    const saved = await this.userModelRepository.save(user);
    return new UserEntity(
      saved.id,
      saved.email,
      saved.passwordHash,
      saved.inviteToken,
      saved.tokenExpiry,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userModel = await this.userModelRepository.findOne({ where: { email } });
    if (!userModel) return null;
    return new UserEntity(
      userModel.id,
      userModel.email,
      userModel.passwordHash,
      userModel.inviteToken,
      userModel.tokenExpiry,
    );
  }

  async findByInviteToken(token: string): Promise<UserEntity | null> {
    const userModel = await this.userModelRepository.findOne({ where: { inviteToken: token } });
    if (!userModel) return null;
    return new UserEntity(
      userModel.id,
      userModel.email,
      userModel.passwordHash,
      userModel.inviteToken,
      userModel.tokenExpiry,
    );
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.userModelRepository.update(id, { passwordHash });
    await this.clearInviteToken(id)
  }

  async updateInviteToken(id: string, token: string, expiry: Date): Promise<void> {
    await this.userModelRepository.update(id, { inviteToken: token, tokenExpiry: expiry });
  }

 async clearInviteToken(id: string): Promise<void> {
  await this.userModelRepository.update(id, { inviteToken: null as any, tokenExpiry: null as any });
}

}
