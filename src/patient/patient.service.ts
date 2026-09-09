import { Injectable } from '@nestjs/common';
import { Patient } from './entities/patient.entity.js';

@Injectable()
export class PatientService {
  private readonly patients: Patient[] = [
    { id: 1, name: 'Nasma ', email: 'nasma@example.com' },
    { id: 2, name: 'Ahmad ', email: 'ahmad@example.com' },
  ];

  findAll() {
    return this.patients;
  }

  exists(id: number): boolean {
    return this.patients.some((patient) => patient.id === Number(id));
  }
}