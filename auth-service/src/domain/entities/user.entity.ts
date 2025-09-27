export class UserEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly passwordHash?: string; //undefined
  public readonly inviteToken?: string;
  public readonly tokenExpiry?: Date;

  constructor(
    id: string,
    email: string,
    passwordHash?: string,
    inviteToken?: string,
    tokenExpiry?: Date,
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.inviteToken = inviteToken;
    this.tokenExpiry = tokenExpiry;
  }

  static create(id: string, email: string): UserEntity {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return new UserEntity(id, email, undefined, token, expiry);
  }

  isTokenExpired(): boolean {
    return this.tokenExpiry ? this.tokenExpiry < new Date() : false;
  }
}
