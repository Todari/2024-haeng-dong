import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  const authService = {
    loginWithPassword: jest.fn(),
  };
  const configService = {
    get: jest.fn(),
  };
  const cookie = jest.fn();
  const response = { cookie } as unknown as Response;

  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(
      authService as unknown as AuthService,
      configService as unknown as ConfigService,
    );
  });

  it('비회원 비밀번호 로그인 토큰을 HttpOnly 쿠키로 발급한다', async () => {
    authService.loginWithPassword.mockResolvedValue({ token: 'guest-token' });

    const result = await controller.login('event-token', '1234', response);

    expect(result).toEqual({ token: 'guest-token' });
    expect(cookie).toHaveBeenCalledWith(
      'accessToken',
      'guest-token',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }),
    );
  });
});
