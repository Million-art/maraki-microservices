import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository{
    abstract save(user: UserEntity): Promise<UserEntity>
    abstract findByEmail(email: string): Promise<UserEntity | null >
    abstract findByInviteToken(token: string): Promise<UserEntity | null>
    abstract updatePassword(id: string, passwordHash: string): Promise<void>
    abstract updateInviteToken(id: string, token: string, expiry: Date): Promise<void>
}