import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CreateUserDto } from '../user/dto/create-user-dto.js';
import { UserResponseDto } from '../user/dto/user-response.dto.js'; 
import { UserRole } from '@prisma/client'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, rawPass: string): Promise<UserResponseDto> {
    const userWithPass = await this.userService.findByEmailWithPassword(email);
    if (!userWithPass || !userWithPass.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(rawPass, userWithPass.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return new UserResponseDto(userWithPass);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto, UserRole.PATIENT);
    const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }
}