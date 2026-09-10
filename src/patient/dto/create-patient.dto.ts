import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'Patient name is required' })
  @IsString({ message: 'Patient name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Patient email is required' })
  @IsEmail({}, { message: 'Must be a valid email format' })
  email: string;
}
