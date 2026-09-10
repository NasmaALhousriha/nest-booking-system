import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';

export interface Doctor {
  id: number;
  name: string;
  specialty?: string;
}

@Injectable()
export class DoctorsService {
  private readonly doctors: Doctor[] = [
    { id: 1, name: 'Dr. Nasma', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Lyana', specialty: 'Pediatrics' },
    { id: 3, name: 'Dr. Ali', specialty: 'Dermatology' },
  ];
  private sequenceId = 4;

  exists(doctorId: number): boolean {
    return this.doctors.some((doctor) => doctor.id === Number(doctorId));
  }

  findAll(): Doctor[] {
    return this.doctors;
  }

  findById(doctorId: number): Doctor | undefined {
    return this.doctors.find((d) => d.id === Number(doctorId));
  }

  create(dto: CreateDoctorDto): Doctor {
    const doctor: Doctor = {
      id: this.sequenceId++,
      name: dto.name,
      specialty: dto.specialty || 'General',
    };
    this.doctors.push(doctor);
    return doctor;
  }
}