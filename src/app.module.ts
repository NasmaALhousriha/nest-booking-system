import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { BookingModule } from './booking/booking.module.js';
import { DoctorModule } from './doctor/doctor.module.js';
import { PatientModule } from './patient/patient.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    
      BookingModule,
      DoctorModule,
      PatientModule,

    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      // بدي طبقها على كل الراوتات
      consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
