import { IsNotEmpty, IsNumber, IsDateString, IsInt } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  doctorId: number;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Appointment time must be a valid ISO date string' })
  appointmentTime: string; 
}