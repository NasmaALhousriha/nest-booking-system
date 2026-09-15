import { Controller, Get, Param, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.patientService.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} was not found.`);
    }
    return patient;
  }
}