import { Controller, Get, Param, ParseIntPipe, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { PatientService } from './patient.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../../generated/index.js';

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
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const currentUserId = req.user.id;   
    const currentUserRole = req.user.role;

    const patient = await this.patientService.findById(id, currentUserId, currentUserRole);
    
    return patient;
  }
}