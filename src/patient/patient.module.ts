import { Module } from '@nestjs/common';
import { PatientService } from './patient.service.js';

@Module({
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}