import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController cookie isolation', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let res: {
    cookies: { name: string; value: any; options?: any }[];
    cleared: { name: string; options?: any }[];
    cookie: (name: string, value: any, options?: any) => void;
    clearCookie: (name: string, options?: any) => void;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    res = {
      cookies: [],
      cleared: [],
      cookie(name, value, options) {
        this.cookies.push({ name, value, options });
      },
      clearCookie(name, options) {
        this.cleared.push({ name, options });
      },
    };
  });

  it('sets only user cookie on user login', async () => {
    authService.login.mockResolvedValue({
      access_token: 'user-token',
      user: { id: '1', email: 'u@example.com', username: 'user1', role: 'USER' },
    });

    await controller.login({ user: { id: '1', email: 'u@example.com', role: 'USER' } } as any, { email: '', password: '' } as any, res as any);

    expect(res.cookies.find((c) => c.name === 'user_access_token')).toBeDefined();
    expect(res.cookies.find((c) => c.name === 'admin_access_token')).toBeUndefined();
  });

  it('rejects non-admin logins on admin endpoint', async () => {
    await expect(
      controller.adminLogin({ user: { id: '2', email: 'x', role: 'USER' } } as any, { email: '', password: '' } as any, res as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('sets only admin cookie on admin login', async () => {
    authService.login.mockResolvedValue({
      access_token: 'admin-token',
      user: { id: '2', email: 'a@example.com', username: 'admin', role: 'ADMIN' },
    });

    await controller.adminLogin({ user: { id: '2', email: 'a@example.com', role: 'ADMIN' } } as any, { email: '', password: '' } as any, res as any);

    expect(res.cookies.find((c) => c.name === 'admin_access_token')).toBeDefined();
    expect(res.cookies.find((c) => c.name === 'user_access_token')).toBeUndefined();
  });

  it('clears only user cookie on user logout', async () => {
    await controller.logout(res as any);

    expect(res.cleared.find((c) => c.name === 'user_access_token')).toBeDefined();
    expect(res.cleared.find((c) => c.name === 'admin_access_token')).toBeUndefined();
  });

  it('clears only admin cookie on admin logout', async () => {
    await controller.adminLogout(res as any);

    expect(res.cleared.find((c) => c.name === 'admin_access_token')).toBeDefined();
    expect(res.cleared.find((c) => c.name === 'user_access_token')).toBeUndefined();
  });
});

