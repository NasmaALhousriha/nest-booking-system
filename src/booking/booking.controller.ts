import { Controller, Post, Get, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  public createNewBooking(
    @CurrentUser() activeUser: any,
    @Body() payload: CreateBookingDto,
  ) {
    const targetPatientId = Number(activeUser?.id ?? activeUser?.sub);
    return this.bookingService.createBooking(targetPatientId, payload);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  public getAllBookings(@CurrentUser() activeUser: any) {
    if (activeUser?.role === UserRole.ADMIN || activeUser?.role === UserRole.DOCTOR) {
      return this.bookingService.findAll();
    }
    return this.bookingService.findByPatientId(Number(activeUser?.id));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  public getBookingById(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findById(id);
  }
}