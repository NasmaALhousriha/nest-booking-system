import { Module } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { BookingController } from './booking.controller.js';
import { DoctorModule } from '../doctor/doctor.module.js';

@Module({
  imports: [DoctorModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}