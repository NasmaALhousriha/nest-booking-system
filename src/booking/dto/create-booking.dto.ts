import { IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  doctorId: number;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Appointment time must be a valid ISO date string' })
  appointmentTime: string; 
}