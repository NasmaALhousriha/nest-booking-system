// src/booking/interfaces/booking.interface.ts
export interface Booking {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentTime: Date;
  status: string;
}