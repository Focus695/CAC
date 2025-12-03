import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType, OrderStatus, PaymentStatus } from '@prisma/client';

// Address DTO used for order creation
export class OrderAddressDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  address1: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  country: string;

  @ApiProperty({ example: '555-1234' })
  @IsString()
  phone: string;
}

// Main order creation DTO
export class CreateOrderDto {
  @ApiProperty({ type: OrderAddressDto })
  @IsObject()
  shippingAddress: OrderAddressDto;

  @ApiProperty({ type: OrderAddressDto, required: false })
  @IsOptional()
  @IsObject()
  billingAddress?: OrderAddressDto;

  @ApiProperty({ example: 'credit_card' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'Please leave package at the door', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// DTO for updating order status
export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

// DTO for updating payment status
export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  // For future Stripe integration
  @ApiProperty({ example: 'pi_123456789', required: false })
  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;
}
