import { PrismaClient } from '../generated/index.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./clinic.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@clinic.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@clinic.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created.');
  }

  const existingDoctor = await prisma.user.findUnique({
    where: { email: 'dr.ahmad@clinic.com' },
  });

  if (!existingDoctor) {
    const hashedDoctorPassword = await bcrypt.hash('DoctorPassword123!', 10);
    await prisma.$transaction(async (tx) => {
      const doctorUser = await tx.user.create({
        data: {
          name: 'Dr. Ahmad',
          email: 'dr.ahmad@clinic.com',
          password: hashedDoctorPassword,
          role: 'DOCTOR',
        },
      });

      await tx.doctor.create({
        data: {
          userId: doctorUser.id,
          specialty: 'General',
        },
      });
    });
    console.log('Default Doctor created (with doctor profile).');
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });