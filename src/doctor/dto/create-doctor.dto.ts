import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty({ message: 'Doctor name is required' })
  @IsString({ message: 'Doctor name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Specialty must be a string' })
  specialty?: string;
}
