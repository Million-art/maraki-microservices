import { Roles } from '../../domain/interfaces/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ enum: Roles })
  role: Roles;

  @Column({ default: true })
  isActive: boolean;
}
