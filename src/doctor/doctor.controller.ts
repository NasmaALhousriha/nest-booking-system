import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctor.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorsService) {}

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const doctor = this.doctorService.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} was not found.`);
    }
    return doctor;
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }
}