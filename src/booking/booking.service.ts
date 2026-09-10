import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { Booking } from './entities/booking.entity.js';
import { DoctorsService } from '../doctor/doctor.service.js';
import { PatientService } from '../patient/patient.service.js';

@Injectable()
export class BookingService {
  private readonly registry: Booking[] = [];
  private sequenceId = 1;

  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly patientService: PatientService,
  ) {}

  async createBooking(patientId: number, payload: CreateBookingDto): Promise<Booking> {
    const isPatientValid = this.patientService.exists(patientId);
    if (!isPatientValid) {
      throw new NotFoundException(`The patient with ID ${patientId} was not found.`);
    }

    const isDoctorAvailable = this.doctorsService.exists(payload.doctorId);
    if (!isDoctorAvailable) {
      throw new NotFoundException(`The requested doctor with ID ${payload.doctorId} was not found.`);
    }

    const scheduledDate = new Date(payload.appointmentTime);
    if (isNaN(scheduledDate.getTime())) {
      throw new BadRequestException('Invalid appointment date/time format.');
    }

    this.verifyTimeConstraints(scheduledDate);
    this.enforceNoConflicts(patientId, payload.doctorId, scheduledDate);

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

  private verifyTimeConstraints(targetDate: Date): void {
    const currentMoment = new Date();
    const maxAllowedLimit = new Date();
    maxAllowedLimit.setMonth(maxAllowedLimit.getMonth() + 1);

    if (targetDate.getTime() < currentMoment.getTime()) {
      throw new BadRequestException('Appointments cannot be scheduled in the past.');
    }

    if (targetDate.getTime() > maxAllowedLimit.getTime()) {
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

  private enforceNoConflicts(patientId: number, doctorId: number, targetDate: Date): void {
    const targetTime = targetDate.getTime();
    const thirtyMinutesMs = 30 * 60 * 1000;

    const doctorBooked = this.registry.some((entry) => {
      if (entry.doctorId !== doctorId) {
        return false;
      }
      const existingTime = new Date(entry.appointmentTime).getTime();
      return Math.abs(targetTime - existingTime) < thirtyMinutesMs;
    });

    if (doctorBooked) {
      throw new ConflictException('The requested doctor is already booked for this time slot (30-minute interval required).');
    }

    const patientCooldownViolation = this.registry.some((entry) => {
      if (entry.patientId !== patientId || entry.doctorId !== doctorId) {
        return false;
      }
      const existingTime = new Date(entry.appointmentTime).getTime();
      return Math.abs(targetTime - existingTime) < thirtyMinutesMs;
    });

    if (patientCooldownViolation) {
      throw new ConflictException('You must have at least a 30-minute gap between your appointments with the same doctor.');
    }
  }

  findAll(): Booking[] {
    return this.registry;
  }

  findById(id: number): Booking {
    const booking = this.registry.find((b) => b.id === Number(id));
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} was not found.`);
    }
    return booking;
  }

  findByPatientId(patientId: number): Booking[] {
    return this.registry.filter((b) => b.patientId === Number(patientId));
  }
}