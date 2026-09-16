import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../generated/index.js';
import { Patient, User } from '@prisma/client';

export type PatientWithUser = Patient & { user: Omit<User, 'password'> };

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<PatientWithUser[]> {
    return this.prisma.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async exists(id: number): Promise<boolean> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: Number(id) },
    });
    return !!patient;
  }

  async findById(id: number): Promise<PatientWithUser | null> {
    return this.prisma.patient.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }
}