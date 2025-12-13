import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { AdminUpdateUserDto } from '../users/dto/admin-user.dto';
import { CreateAdminProductDto, UpdateAdminProductDto } from '../products/dto/admin-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { ALLOWED_IMAGE_MIME_TYPES, UPLOADS_DIRNAME, UPLOADS_ROUTE_PREFIX } from './uploads.constants';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) { }

  // User Management
  @Get('users')
  getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('role') role: string,
    @Query('isActive') isActive: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc'
  ) {
    return this.usersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      {
        role,
        isActive: isActive ? JSON.parse(isActive) : undefined,
      },
      sortField ? { field: sortField, order: sortOrder || 'asc' } : undefined
    );
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: AdminUpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Product Management
  @Get('products')
  getProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('categoryId') categoryId: string,
    @Query('isActive') isActive: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc'
  ) {
    return this.productsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      {
        categoryId,
        isActive: isActive ? JSON.parse(isActive) : undefined,
      },
      sortField ? { field: sortField, order: sortOrder || 'asc' } : undefined
    );
  }

  @Post('products')
  createProduct(@Body() productData: CreateAdminProductDto) {
    return this.productsService.create(productData);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() productData: UpdateAdminProductDto) {
    return this.productsService.update(id, productData);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch('products/:id/status')
  toggleProductStatus(@Param('id') id: string) {
    return this.productsService.toggleStatus(id);
  }

  // Publish workflow (recommended)
  @Patch('products/:id/publish')
  publishProduct(@Param('id') id: string) {
    return this.productsService.publish(id);
  }

  @Patch('products/:id/unpublish')
  unpublishProduct(@Param('id') id: string) {
    return this.productsService.unpublish(id);
  }

  // Image uploads (admin only)
  @Post('uploads/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIRNAME,
        filename: (_req, file, cb) => {
          const safeExt = extname(file.originalname || '').toLowerCase() || '.jpg';
          cb(null, `${randomUUID()}${safeExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        cb(null, ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    })
  )
  uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded (PNG/JPG/JPEG only)');
    return {
      url: `${UPLOADS_ROUTE_PREFIX}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('uploads/images')
  @UseInterceptors(
    FilesInterceptor('files', 9, {
      storage: diskStorage({
        destination: UPLOADS_DIRNAME,
        filename: (_req, file, cb) => {
          const safeExt = extname(file.originalname || '').toLowerCase() || '.jpg';
          cb(null, `${randomUUID()}${safeExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        cb(null, ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB each
    })
  )
  uploadImages(@UploadedFiles() files?: Express.Multer.File[]) {
    const list = Array.isArray(files) ? files : [];
    if (list.length === 0) throw new BadRequestException('No files uploaded (PNG/JPG/JPEG only)');
    return {
      images: list.map((f) => ({
        url: `${UPLOADS_ROUTE_PREFIX}/${f.filename}`,
        filename: f.filename,
        originalName: f.originalname,
        size: f.size,
        mimeType: f.mimetype,
      })),
    };
  }

  @Put('products/:id/publish')
  publishProduct(@Param('id') id: string) {
    return this.productsService.publish(id);
  }

  @Put('products/:id/unpublish')
  unpublishProduct(@Param('id') id: string) {
    return this.productsService.unpublish(id);
  }

  // Order Management
  @Get('orders')
  getOrders(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('paymentStatus') paymentStatus: string,
    @Query('paymentMethod') paymentMethod: string,
    @Query('userId') userId: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc'
  ) {
    return this.ordersService.getAllOrders(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      {
        status: status as any, // Convert string to OrderStatus enum
        paymentStatus: paymentStatus as any, // Convert string to PaymentStatus enum
        paymentMethod,
        userId,
      },
      sortField ? { field: sortField, order: sortOrder || 'asc' } : undefined
    );
  }

  @Get('orders/:id')
  getOrderDetails(@Param('id') id: string) {
    return this.ordersService.getOrderDetails(id);
  }

  @Put('orders/:id/ship')
  shipOrder(@Param('id') id: string, @Body() body: { trackingNumber: string }) {
    return this.ordersService.shipOrder(id, body.trackingNumber);
  }

  @Put('orders/:id/deliver')
  deliverOrder(@Param('id') id: string) {
    return this.ordersService.markOrderDelivered(id);
  }

  @Put('orders/:id/confirm')
  confirmOrder(@Param('id') id: string) {
    return this.ordersService.updateOrderStatus(id, { status: 'CONFIRMED' as any });
  }

  @Put('orders/:id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.updateOrderStatus(id, { status: 'CANCELLED' as any });
  }

  @Put('orders/:id/update-payment')
  updateOrderPaymentStatus(@Param('id') id: string, @Body() body: { paymentStatus: any }) {
    return this.ordersService.updatePaymentStatus(id, body);
  }
}
