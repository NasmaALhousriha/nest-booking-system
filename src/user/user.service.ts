import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user-dto.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly users: User[] = [];
  private sequenceId = 1;

  async onModuleInit() {
    if (this.users.length === 0) {
      await this.createInternal('Admin User', 'admin@example.com', 'Admin123!', UserRole.ADMIN);
      await this.createInternal('Dr. Nasma', 'doctor@example.com', 'Doctor123!', UserRole.DOCTOR);
      await this.createInternal('Patient One', 'patient@example.com', 'Patient123!', UserRole.PATIENT);
    }
  }

  private async createInternal(name: string, email: string, rawPass: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(rawPass, 10);
    const user = new User({
      id: this.sequenceId++,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.users.push(user);
    return user;
  }

  async create(createUserDto: CreateUserDto, role: UserRole = UserRole.PATIENT): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException(`User with email '${createUserDto.email}' already exists.`);
    }

    const created = await this.createInternal(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      role,
    );

    return this.sanitizeUser(created);
  }

  async findAll(): Promise<User[]> {
    return this.users.map((user) => this.sanitizeUser(user));
  }

  async findById(id: number): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? this.sanitizeUser(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } as User : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user ? this.sanitizeUser(user) : null;
  }

  sanitizeUser(user: User): User {
    const { password: _password, ...safeUser } = user;
    return new User(safeUser);
  }
}
