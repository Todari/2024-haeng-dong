import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('admin/events/:eventToken/auth')
  authenticateAdmin(
    @Param('eventToken') eventToken: string,
    @Body('userId') userId: number,
  ) {
    return this.authService.authenticateAdmin(eventToken, userId);
  }

  @Post('events/:eventToken/login')
  login(
    @Param('eventToken') eventToken: string,
    @Body('password') password: string,
  ) {
    return this.authService.loginWithPassword(eventToken, password);
  }

  @Get('kakao-client-id')
  getKakaoClientId() {
    return {
      clientId: this.configService.get<string>('KAKAO_CLIENT_ID'),
    };
  }

  @Get('login/kakao')
  loginKakao(@Query('code') code: string) {
    return this.authService.loginWithKakao(code);
  }
}
