import { Injectable } from '@nestjs/common';

export interface Doctor {
  id: number;
  name: string;
  
}

@Injectable()
export class DoctorsService {
  private readonly doctors: Doctor[] = [
    { id: 1, name: 'Nasma ' },
    { id: 2, name: 'Lyana' },
    { id: 3, name: 'Ali' },
  ];

  exists(doctorId: number): boolean {
    return this.doctors.some((doctor) => doctor.id === doctorId);
  }

  findAll(): Doctor[] {
    return this.doctors;
  }
}