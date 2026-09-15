import { Exclude } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password?: string | null;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}