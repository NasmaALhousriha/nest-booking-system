import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty({ message: 'Doctor name is required' })
  @IsString({ message: 'Doctor name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Specialty must be a string' })
  specialty?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}