import { UserInterface } from '../interfaces/user.interface';
import { Roles } from '../interfaces/enums';

export class UserEntity implements UserInterface {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly role: Roles;
  public readonly isActive: boolean;

  constructor(
    id: string,
    name: string,
    email: string,
    role: Roles,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = isActive;

    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('User Id is required');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('User name is required');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Incorrect Email');
    }
    if (!this.role) {
      throw new Error('User role is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static create(
    name: string,
    email: string,
    role = Roles.ADMIN,
  ): UserEntity {
    const id = crypto.randomUUID();
    return new UserEntity(id, name, email, role); // isActive defaults to true
  }

  public updateProfile(name: string, email?: string): UserEntity {
    return new UserEntity(
      this.id,
      name,
      email || this.email,
      this.role,
      this.isActive,
    );
  }

  public changeRole(newRole: Roles): UserEntity {
    if (this.role === Roles.SUPERADMIN) {
      throw new Error('SuperAdmin role cannot be changed');
    }
    return new UserEntity(
      this.id,
      this.name,
      this.email,
      newRole,
      this.isActive,
    );
  }

  public deactivateUser(): UserEntity {
    if (!this.isActive) {
      throw new Error('User is already deactivated');
    }
    return new UserEntity(this.id, this.name, this.email, this.role, false);
  }

  public activateUser(): UserEntity {
    if (this.isActive) {
      throw new Error('User is already activated');
    }
    return new UserEntity(this.id, this.name, this.email, this.role, true);
  }
}
