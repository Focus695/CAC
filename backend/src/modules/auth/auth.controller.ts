import { Controller, Post, Get, Body, UseGuards, Request, Response } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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

    // 设置HttpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, // 在生产环境中应设置为true
      maxAge: 3600000, // 1小时
      path: '/',
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

    // 设置HttpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, // 在生产环境中应设置为true
      maxAge: 3600000, // 1小时
      path: '/',
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
    // Clear the access_token cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // 在生产环境中应设置为true
      path: '/',
    });

    return { message: 'Logout successful' };
  }
}
