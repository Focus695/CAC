import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS - Allow all localhost ports for development
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Create default admin user
  const usersService = app.get(require('./modules/users/users.service').UsersService);
  const adminEmail = 'zenchill@example.com';
  const adminPassword = 'zenchill888';

  const existingAdmin = await usersService.findByEmail(adminEmail);
  if (!existingAdmin) {
    const hashedPassword = await require('bcryptjs').hash(adminPassword, 10);
    await usersService.create({
      email: adminEmail,
      password: hashedPassword,
      username: 'zenchill',
      role: 'ADMIN', // Use the existing ADMIN role from the schema
    });
    console.log('Default admin user created:');
    console.log(`Username: zenchill`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Role: SUPER ADMIN');
  }

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global interceptor and filter
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('CAC E-commerce API')
    .setDescription('API documentation for CAC E-commerce PWA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Set up Swagger - explicitly specify options to ensure correct path generation
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();
