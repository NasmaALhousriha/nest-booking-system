import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '../generated/index.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface DoctorResponse {
  id: number;
  name: string;
  email: string;
  specialty?: string;
}

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaClient) {}

  async exists(doctorId: number): Promise<boolean> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: Number(doctorId) },
    });
    return !!doctor;
  }

  async findAll(): Promise<DoctorResponse[]> {
    const doctors = await this.prisma.doctor.findMany({
      include: { user: true }, 
    });

    return doctors.map((doc: any) => ({
      id: doc.id,
      name: doc.user.name,
      email: doc.user.email,
      specialty: doc.specialty,
    }));
  }

  async findById(doctorId: number): Promise<DoctorResponse> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: Number(doctorId) },
      include: { user: true },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found.`);
    }

    return {
      id: doctor.id,
      name: doctor.user.name,
      email: doctor.user.email,
      specialty: doctor.specialty,
    };
  }

  async create(dto: CreateDoctorDto): Promise<DoctorResponse> {
    const hashedPassword = await bcrypt.hash('DoctorDefault123!', 10);
    
    const baseEmail = dto.name.toLowerCase().replace(/\s+/g, '');
    let email = `${baseEmail}@clinic.com`;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      email = `${baseEmail}${randomSuffix}@clinic.com`;
    }

    try {
      const newDoctor = await this.prisma.doctor.create({
        data: {
          specialty: dto.specialty || 'General',
          user: {
            create: {
              name: dto.name,
              email: email,
              password: hashedPassword,
              role: UserRole.DOCTOR,
            },
          },
        },
        include: { user: true },
      });

      return {
        id: newDoctor.id,
        name: newDoctor.user.name,
        email: newDoctor.user.email,
        specialty: newDoctor.specialty,
      };
    } catch (error:any) {
      if (error.code === 'P2002') {
        throw new ConflictException('A user with this email already exists.');
      }
      throw error;
    }
  }
}