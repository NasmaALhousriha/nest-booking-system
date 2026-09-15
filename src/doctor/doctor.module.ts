import { Module } from '@nestjs/common';
import { DoctorsService } from './doctor.service.js';
import {DoctorsController } from './doctor.controller.js';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorModule {}