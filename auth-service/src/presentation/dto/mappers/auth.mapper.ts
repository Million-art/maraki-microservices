import { SetPasswordDto } from '../set-password.dto';
import { LoginDto } from '../login.dto';
import { ResendInviteDto } from '../resend-invite.dto';
import { SetPasswordRequest } from '../../../application/interfaces/set-password.interface';
import { LoginRequest } from '../../../application/interfaces/login.interface';
import { ResendInviteRequest } from '../../../application/interfaces/resend-invite.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

export class AuthMapper {
  static toSetPasswordRequest(dto: SetPasswordDto, token: string): SetPasswordRequest {
    return {
      token,
      password: dto.password,
    };
  }

  static toLoginRequest(dto: LoginDto): LoginRequest {
    return {
      email: dto.email,
      password: dto.password,
    };
  }

  static toResendInviteRequest(dto: ResendInviteDto): ResendInviteRequest {
    return {
      email: dto.email,
    };
  }

  // Example mapper to domain entity if needed for response or other uses
  static toUserEntity(userData: any): UserEntity {
    return new UserEntity(
      userData.id,
      userData.email,
      userData.passwordHash,
      userData.inviteToken,
      userData.tokenExpiry,
    );
  }

  // Mapper from entity to response DTO if needed (e.g., for user profile after login)
  static toUserResponse(user: UserEntity): any {
    return {
      id: user.id,
      email: user.email,
      // Exclude sensitive fields like passwordHash, inviteToken
    };
  }
}
