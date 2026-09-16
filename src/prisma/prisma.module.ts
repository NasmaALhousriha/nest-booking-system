import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '../generated/index.js';

@Global() // هي بتخلي الmodule متاحة بكل مكان
@Module({
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}