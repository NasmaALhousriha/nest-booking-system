import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import {  Booking } from '../../generated/index.js';
import { PrismaService } from '../prisma/prisma.service.js'; 

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}
async createBooking(userId: number, payload: CreateBookingDto): Promise<Booking> {
  const patient = await this.prisma.patient.findUnique({
    where: { userId: Number(userId) },
  });
  if (!patient) throw new NotFoundException(`Patient profile not found for this user.`);

  const doctorUser = await this.prisma.user.findUnique({
    where: { id: Number(payload.doctorId), role: 'DOCTOR' },
  });
  if (!doctorUser) throw new NotFoundException(`The requested doctor with ID ${payload.doctorId} was not found.`);

  const doctorProfile = await this.prisma.doctor.findUnique({
    where: { userId: doctorUser.id },
  });
  if (!doctorProfile) throw new NotFoundException(`Doctor profile not found for user ID ${doctorUser.id}.`);

  const scheduledDate = new Date(payload.appointmentTime);
  if (isNaN(scheduledDate.getTime())) throw new BadRequestException('Invalid appointment date/time format.');

  this.verifyTimeConstraints(scheduledDate);

  return this.prisma.$transaction(
    async (tx) => {
      await this.enforceNoConflicts(tx, patient.id, doctorProfile.id, scheduledDate);

      return tx.booking.create({
        data: {
          patientId: patient.id,
          doctorId: doctorProfile.id,
          appointmentTime: scheduledDate,
          status: 'CONFIRMED',
        },
      });
    },
    { isolationLevel: 'Serializable' },
  );
}

private async enforceNoConflicts(tx: any, patientId: number, doctorId: number, targetDate: Date): Promise<void> {
  const thirtyMinutesBefore = new Date(targetDate.getTime() - 30 * 60 * 1000);
  const thirtyMinutesAfter = new Date(targetDate.getTime() + 30 * 60 * 1000);

  const doctorConflict = await tx.booking.findFirst({
    where: {
      doctorId: Number(doctorId),
      appointmentTime: { gte: thirtyMinutesBefore, lte: thirtyMinutesAfter },
      status: { not: 'CANCELLED' },
    },
  });
  if (doctorConflict) throw new ConflictException('The requested doctor is already booked for this time slot (30-minute interval required).');

  const patientConflict = await tx.booking.findFirst({
    where: {
      patientId: Number(patientId),
      appointmentTime: { gte: thirtyMinutesBefore, lte: thirtyMinutesAfter },
      status: { not: 'CANCELLED' },
    },
  });
  if (patientConflict) throw new ConflictException('You already have another appointment within 30 minutes of this time slot.');
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

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        patient: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(bookingId: number, userId: number, userRole: string) {
    let patientId: number | undefined = undefined;
    if (userRole === 'PATIENT') {
      const patient = await this.prisma.patient.findUnique({
        where: { userId: Number(userId) },
      });

      if (!patient) {
        throw new NotFoundException(`Patient profile not found.`);
      }
      patientId = patient.id;
    }
    const whereCondition: any = { id: Number(bookingId) };
    if (userRole === 'PATIENT') {
      whereCondition.patientId = patientId;
    }

    const booking = await this.prisma.booking.findFirst({
      where: whereCondition,
      include: {
        patient: {
          include: {
            user: { omit: { password: true } },
          },
        },
        doctor: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} was not found or you do not have permission to view it.`);
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
        doctor: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });
  }
}