import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'; 
import { Patient, User } from '../../generated/index.js';

export type PatientWithUser = Patient & { user: Omit<User, 'password'> };

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findById(id: number, userId: number, userRole: string): Promise<PatientWithUser> {
    let patient;
    if (userRole === 'PATIENT') {
      patient = await this.prisma.patient.findUnique({
        where: { userId: Number(userId) }, 
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
    } else {
      patient = await this.prisma.patient.findUnique({
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

    if (!patient) {
      throw new NotFoundException(`Patient profile was not found.`);
    }

    if (userRole === 'PATIENT' && patient.userId !== Number(userId)) {
      throw new ForbiddenException('You do not have permission to view another patient\'s profile.');
    }

    return patient;
  }
}