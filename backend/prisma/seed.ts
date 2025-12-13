import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // Create a secure password
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          username: 'admin',
          role: 'ADMIN',
          isActive: true,
        },
      });

      console.log('Admin user created successfully:');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: ${adminPassword}`);
      console.log(`Role: ${adminUser.role}`);
      console.log('Please change the password immediately after first login!');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
