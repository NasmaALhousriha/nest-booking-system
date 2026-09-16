import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // هي بتخلي الmodule متاحة بكل مكان
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}