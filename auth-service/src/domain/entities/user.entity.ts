export class UserEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly passwordHash?: string;
  public readonly inviteToken?: string;
  public readonly tokenExpiry?: Date;
  public readonly roles: string[];  

  constructor(
    id: string,
    email: string,
    passwordHash?: string,
    inviteToken?: string,
    tokenExpiry?: Date,
    roles: string[] = ['admin'], 
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.inviteToken = inviteToken;
    this.tokenExpiry = tokenExpiry;
    this.roles = roles;
  }

  static create(id: string, email: string, roles: string[] = ['user']): UserEntity {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return new UserEntity(id, email, undefined, token, expiry, roles);
  }

  isTokenExpired(): boolean {
    return this.tokenExpiry ? this.tokenExpiry < new Date() : false;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  addRole(role: string): UserEntity {
    if (!this.roles.includes(role)) {
      const updatedRoles = [...this.roles, role];
      return new UserEntity(
        this.id,
        this.email,
        this.passwordHash,
        this.inviteToken,
        this.tokenExpiry,
        updatedRoles,
      );
    }
    return this;
  }
}
