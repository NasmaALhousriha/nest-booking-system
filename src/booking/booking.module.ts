import { Module } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { BookingController } from './booking.controller.js';
import { PatientModule } from '../patient/patient.module.js'; 
import { DoctorModule } from '../doctor/doctor.module.js';

@Module({
  imports: [DoctorModule,PatientModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}