import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service.js'; 
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { PatientService } from '../patient/patient.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('bookings')
@UseGuards(RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService,
    private readonly patientService: PatientService,  
  ) {}

  @Post()
  @Roles('PATIENT')
  public createNewBooking(
    @CurrentUser() activeUser: any,
    @Body() payload: CreateBookingDto,
  ) {
    const targetPatientId = Number(activeUser?.id ?? activeUser?.sub);

    return this.bookingService.createBooking(targetPatientId, payload);
  }
}