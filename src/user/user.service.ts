import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto.js';
import { UserResponseDto } from './dto/user-response.dto.js'; 
import { PrismaClient } from '../generated/index.js';
import { UserRole, User } from '@prisma/client';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly prisma: PrismaClient) {}

  async onModuleInit() {
    const count = await this.prisma.user.count();
    if (count === 0) {
      await this.createInternal('Admin User', 'admin@example.com', 'Admin123!', UserRole.ADMIN);
      await this.createInternal('Dr. Nasma', 'doctor@example.com', 'Doctor123!', UserRole.DOCTOR);
      await this.createInternal('Patient One', 'patient@example.com', 'Patient123!', UserRole.PATIENT);
    }
  }

  private async createInternal(
    name: string,
    email: string,
    rawPass: string,
    role: UserRole,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(rawPass, 10);
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role,
        },
      });
      if (role === UserRole.PATIENT) {
        await tx.patient.create({
          data: { userId: user.id },
        });
      }
      return user;
    });
  }

  async create(createUserDto: CreateUserDto, role: UserRole = UserRole.PATIENT): Promise<UserResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException(`User with email '${createUserDto.email}' already exists.`);
    }

    const created = await this.createInternal(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      role,
    );

    return new UserResponseDto(created);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserResponseDto(user));
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    return user ? new UserResponseDto(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user ? new UserResponseDto(user) : null;
  }
}