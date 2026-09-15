import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
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
  constructor(private readonly prisma: PrismaService) {}

  async exists(doctorId: number): Promise<boolean> {
    const doctor = await this.prisma.user.findFirst({
      where: {
        id: Number(doctorId),
        role: UserRole.DOCTOR,
      },
    });
    return !!doctor;
  }

  async findAll(): Promise<DoctorResponse[]> {
    const doctors = await this.prisma.user.findMany({
      where: { role: UserRole.DOCTOR },
    });

    return doctors.map((doc) => ({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      specialty: 'General',
    }));
  }

  async findById(doctorId: number): Promise<DoctorResponse> {
    const doctor = await this.prisma.user.findFirst({
      where: {
        id: Number(doctorId),
        role: UserRole.DOCTOR,
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found.`);
    }

    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      specialty: 'General',
    };
  }

  async create(dto: CreateDoctorDto): Promise<DoctorResponse> {
    const hashedPassword = await bcrypt.hash('DoctorDefault123!', 10);
    const email = `${dto.name.toLowerCase().replace(/\s+/g, '')}@clinic.com`;

    const newDoctor = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
      },
    });

    return {
      id: newDoctor.id,
      name: newDoctor.name,
      email: newDoctor.email,
      specialty: dto.specialty || 'General',
    };
  }
}