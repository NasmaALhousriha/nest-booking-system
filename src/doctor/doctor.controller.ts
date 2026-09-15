import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctor.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'; 
import { RolesGuard } from '../common/guards/roles.guard.js';    
import { Roles } from '../common/decorators/roles.decorator.js'; 
import { UserRole } from '@prisma/client';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.doctorsService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)      
  @Roles(UserRole.ADMIN)               
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }
}