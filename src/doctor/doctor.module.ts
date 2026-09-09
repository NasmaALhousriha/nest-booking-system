import { Module } from '@nestjs/common';
import { DoctorsService } from './doctor.service.js';
import { DoctorController } from './doctor.controller.js';

@Module({
  controllers: [DoctorController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorModule {}