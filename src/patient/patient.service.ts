import { Injectable } from '@nestjs/common';
import { Patient } from './entities/patient.entity.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';

@Injectable()
export class PatientService {
  private readonly patients: Patient[] = [
    { id: 1, name: 'Nasma', email: 'nasma@example.com' },
    { id: 2, name: 'Ahmad', email: 'ahmad@example.com' },
    { id: 3, name: 'Patient One', email: 'patient@example.com' },
  ];
  private sequenceId = 4;

  findAll(): Patient[] {
    return this.patients;
  }

  exists(id: number): boolean {
    return this.patients.some((patient) => patient.id === Number(id));
  }

  findById(id: number): Patient | undefined {
    return this.patients.find((patient) => patient.id === Number(id));
  }

  create(dto: CreatePatientDto): Patient {
    const patient: Patient = {
      id: this.sequenceId++,
      name: dto.name,
      email: dto.email,
    };
    this.patients.push(patient);
    return patient;
  }
}