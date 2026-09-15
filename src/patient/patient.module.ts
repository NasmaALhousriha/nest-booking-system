import { Module } from '@nestjs/common';
import { PatientService } from './patient.service.js';
import { PatientController } from './patient.controller.js';

@Module({
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}