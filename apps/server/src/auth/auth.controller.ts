import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/events/:eventToken/auth')
  authenticateAdmin(
    @Param('eventToken') eventToken: string,
    @CurrentUser('userId') userId: number,
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
  async loginKakao(
    @Query('code') code: string,
    @Query('redirect_uri') redirectUri: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.loginWithKakao(code, redirectUri);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    res.cookie(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'lax',
      maxAge: COOKIE_MAX_AGE * 1000,
      ...(cookieDomain && { domain: cookieDomain }),
      path: '/',
    });

    return {};
  }
}
