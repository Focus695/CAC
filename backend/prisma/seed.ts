import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // Create a secure password
  const adminEmail = 'admin@example.com';
  // Read from environment variable or generate a random password
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD ||
    require('crypto').randomBytes(16).toString('base64');
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    // Seed default categories (idempotent)
    const defaultCategories = [
      { name: 'Incense Beads', slug: 'incense-beads' },
      { name: 'Stick Incense', slug: 'stick-incense' },
      { name: 'Medicated Comb', slug: 'medicated-comb' },
      { name: 'Scented Candles', slug: 'scented-candles' },
    ];

    for (const c of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, isActive: true },
        create: { name: c.name, slug: c.slug, isActive: true },
      });
    }

    console.log('Default categories seeded.');

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

      console.log('=================================================');
      console.log('IMPORTANT: Admin user created');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: ${adminPassword}`);
      console.log(`Role: ${adminUser.role}`);
      console.log('Please save this password and change it immediately!');
      console.log('=================================================');
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
