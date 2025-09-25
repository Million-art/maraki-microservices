import { Roles } from './enums';

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: Roles;
  isActive: boolean;
}
