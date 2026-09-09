import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { Booking } from './entities/booking.entity.js';
import { DoctorsService } from '../doctor/doctor.service.js';

@Injectable()
export class BookingService {
  private readonly registry: Booking[] = [];
  private sequenceId = 1;

  constructor(private readonly doctorsService: DoctorsService) {}

  async createBooking(patientId: number, payload: CreateBookingDto) {
    const isDoctorAvailable = this.doctorsService.exists(payload.doctorId);
    if (!isDoctorAvailable) {
      throw new NotFoundException(`The requested doctor with ID ${payload.doctorId} was not found.`);
    }

    const scheduledDate = new Date(payload.appointmentTime);
    this.verifyTimeConstraints(scheduledDate);

    this.enforceSpamCooldown(patientId, payload.doctorId, scheduledDate);

    const createdBooking: Booking = {
      id: this.sequenceId++,
      patientId,
      doctorId: payload.doctorId,
      appointmentTime: scheduledDate,
      status: 'CONFIRMED',
    };

    this.registry.push(createdBooking);
    return createdBooking;
  }

  private verifyTimeConstraints(targetDate: Date) {
    const currentMoment = new Date();
    const maxAllowedLimit = new Date();
    maxAllowedLimit.setMonth(maxAllowedLimit.getMonth() + 1);

    if (targetDate < currentMoment) {
      throw new BadRequestException('Appointments cannot be scheduled in the past.');
    }
    if (targetDate > maxAllowedLimit) {
      throw new BadRequestException('Bookings are restricted to a maximum 1-month window.');
    }

    const dayCode = targetDate.getUTCDay();
    const activeHour = targetDate.getUTCHours();

    if (dayCode === 5 || dayCode === 6) {
      throw new BadRequestException('The clinic remains closed during weekends (Friday & Saturday).');
    }
    if (activeHour < 9 || activeHour >= 17) {
      throw new BadRequestException('Reservations are only permitted during official hours (09:00 AM - 05:00 PM UTC).');
    }
  }

  private enforceSpamCooldown(patientId: number, doctorId: number, targetDate: Date) {
    const targetTime = targetDate.getTime();
    const thirtyMinutesMs = 30 * 60 * 1000;

    const conflictingBooking = this.registry.some((entry) => {
      if (entry.patientId !== patientId || entry.doctorId !== doctorId) {
        return false;
      }
      const existingTime = new Date(entry.appointmentTime).getTime();
      const timeDifference = Math.abs(targetTime - existingTime);
      
      return timeDifference < thirtyMinutesMs;
    });

    if (conflictingBooking) {
      throw new ConflictException('You must have at least a 30-minute gap between your appointments with the same doctor.');
    }
  }

  findAll() {
    return this.registry;
  }
}