import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 检查邮箱是否已经存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('邮箱已经被注册');
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: { role?: string; isActive?: boolean },
    sort?: { field: string; order: 'asc' | 'desc' }
  ) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search by email, username, or name
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by role
    if (filter?.role) {
      where.role = filter.role;
    }

    // Filter by active status
    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    // Build order by clause
    const orderBy: any = {};
    if (sort?.field) {
      orderBy[sort.field] = sort.order;
    } else {
      // Default sort by createdAt descending
      orderBy.createdAt = 'desc';
    }

    // Get total count
    const totalCount = await this.prisma.user.count({ where });

    // Get users
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      skip,
      take: limit,
      orderBy,
    });

    // Return with pagination info
    return {
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
