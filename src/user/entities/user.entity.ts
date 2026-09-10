import { Exclude } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum.js';

export class User {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password?: string;

  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
