import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Booking } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: number, payload: CreateBookingDto): Promise<Booking> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: Number(userId) },
    });

    if (!patient) {
      throw new NotFoundException(`Patient profile not found for this user.`);
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: Number(payload.doctorId), role: 'DOCTOR' },
    });

    if (!doctor) {
      throw new NotFoundException(`The requested doctor with ID ${payload.doctorId} was not found.`);
    }

    const scheduledDate = new Date(payload.appointmentTime);
    if (isNaN(scheduledDate.getTime())) {
      throw new BadRequestException('Invalid appointment date/time format.');
    }

    this.verifyTimeConstraints(scheduledDate);
    
    await this.enforceNoConflicts(patient.id, payload.doctorId, scheduledDate);

    return this.prisma.booking.create({
      data: {
        patientId: patient.id,
        doctorId: payload.doctorId,
        appointmentTime: scheduledDate,
        status: 'CONFIRMED',
      },
    });
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

  private async enforceNoConflicts(patientId: number, doctorId: number, targetDate: Date): Promise<void> {
    const thirtyMinutesBefore = new Date(targetDate.getTime() - 30 * 60 * 1000);
    const thirtyMinutesAfter = new Date(targetDate.getTime() + 30 * 60 * 1000);

    const doctorConflict = await this.prisma.booking.findFirst({
      where: {
        doctorId: Number(doctorId),
        appointmentTime: {
          gte: thirtyMinutesBefore,
          lte: thirtyMinutesAfter,
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (doctorConflict) {
      throw new ConflictException('The requested doctor is already booked for this time slot (30-minute interval required).');
    }

    const patientConflict = await this.prisma.booking.findFirst({
      where: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        appointmentTime: {
          gte: thirtyMinutesBefore,
          lte: thirtyMinutesAfter,
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (patientConflict) {
      throw new ConflictException('You must have at least a 30-minute gap between your appointments with the same doctor.');
    }
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: true,
      },
    });
  }

  async findById(id: number): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        patient: { include: { user: true } },
        doctor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} was not found.`);
    }
    return booking;
  }

  async findByUserId(userId: number): Promise<Booking[]> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: Number(userId) },
    });

    if (!patient) {
      return [];
    }

    return this.prisma.booking.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: true,
      },
    });
  }
}