import { Controller, Post, Get, Body, UseGuards, Request, Response, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() registerDto: RegisterDto, @Response({ passthrough: true }) res: any) {
    const result = await this.authService.register(registerDto.email, registerDto.password, registerDto.username);

    // 设置HttpOnly user cookie，路径为根，仅用于前台用户
    res.cookie('user_access_token', result.access_token, {
      httpOnly: true,
      secure: false, // 在生产环境中应设置为true
      maxAge: 3600000, // 1小时
      path: '/',
      sameSite: 'lax',
    });

    // 向后兼容：仍然返回token在响应体中
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  async login(@Request() req: any, @Body() loginDto: LoginDto, @Response({ passthrough: true }) res: any) {
    const result = await this.authService.login(req.user);

    // 设置HttpOnly user cookie，路径为根，仅用于前台用户
    res.cookie('user_access_token', result.access_token, {
      httpOnly: true,
      secure: false, // 在生产环境中应设置为true
      maxAge: 3600000, // 1小时
      path: '/',
      sameSite: 'lax',
    });

    // 向后兼容：仍然返回token在响应体中
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile (GET)' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  getProfileGet(@Request() req: any) {
    return req.user;
  }

  // Backward compatible endpoint (older docs/clients may use POST)
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Response({ passthrough: true }) res: any) {
    // Clear the user_access_token cookie
    res.clearCookie('user_access_token', {
      httpOnly: true,
      secure: false, // 在生产环境中应设置为true
      path: '/',
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }

  // ---------------- Admin auth (isolated cookie & path) ----------------
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin successfully logged in' })
  async adminLogin(@Request() req: any, @Body() loginDto: LoginDto, @Response({ passthrough: true }) res: any) {
    if (req.user?.role !== 'ADMIN') {
      throw new UnauthorizedException('该账号不是管理员，无法登录后台');
    }

    const result = await this.authService.login(req.user);

    // 管理员使用独立 cookie，路径为根但名称不同，避免与用户态混用
    res.cookie('admin_access_token', result.access_token, {
      httpOnly: true,
      secure: false, // 生产环境应为 true
      maxAge: 3600000,
      path: '/',
      sameSite: 'lax',
    });

    return result;
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('admin/profile')
  @ApiOperation({ summary: 'Get admin profile (admin cookie only)' })
  @ApiResponse({ status: 200, description: 'Admin profile retrieved' })
  getAdminProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post('admin/logout')
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({ status: 200, description: 'Admin successfully logged out' })
  async adminLogout(@Response({ passthrough: true }) res: any) {
    res.clearCookie('admin_access_token', {
      httpOnly: true,
      secure: false, // 生产环境应为 true
      path: '/',
      sameSite: 'lax',
    });

    return { message: 'Admin logout successful' };
  }
}
