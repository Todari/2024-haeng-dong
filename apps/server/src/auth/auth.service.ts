import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticateAdmin(eventToken: string, userId: number) {
    const event = await this.prisma.event.findUnique({
      where: { token: eventToken, deletedAt: null },
    });
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    if (event.userId !== userId) {
      throw new UnauthorizedException('이벤트 관리자가 아닙니다.');
    }

    return {
      token: this.jwtService.sign({
        sub: userId,
        eventToken,
        role: 'admin',
      }),
    };
  }

  async loginWithPassword(eventToken: string, password: string) {
    const event = await this.prisma.event.findUnique({
      where: { token: eventToken, deletedAt: null },
    });
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    const user = await this.prisma.user.findFirst({
      where: { id: event.userId },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return {
      token: this.jwtService.sign({ sub: user.id, eventToken }),
    };
  }

  async loginWithKakao(code: string, redirectUri: string) {
    const kakaoUser = await this.getKakaoUserInfo(code, redirectUri);

    let user = await this.prisma.user.findUnique({
      where: { memberNumber: kakaoUser.id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          nickname: kakaoUser.nickname,
          memberNumber: kakaoUser.id,
          picture: kakaoUser.picture,
        },
      });
    }

    return {
      token: this.jwtService.sign({ sub: user.id, role: 'MEMBER' }),
    };
  }

  private readonly logger = new Logger(AuthService.name);

  private async getKakaoUserInfo(
    code: string,
    redirectUri: string,
  ): Promise<{ id: string; nickname: string; picture: string | null }> {
    const clientId = this.configService.get<string>('KAKAO_CLIENT_ID');
    const clientSecret = this.configService.get<string>('KAKAO_CLIENT_SECRET');
    if (!clientId) {
      this.logger.error('KAKAO_CLIENT_ID가 설정되지 않았습니다.');
      throw new UnauthorizedException('KAKAO_CLIENT_ID가 설정되지 않았습니다.');
    }

    this.logger.log(`카카오 토큰 요청 - redirect_uri: ${redirectUri}`);

    const tokenParams: Record<string, string> = {
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
    };
    if (clientSecret) {
      tokenParams.client_secret = clientSecret;
    }

    const tokenResponse = await fetch(
      'https://kauth.kakao.com/oauth/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(tokenParams),
      },
    );

    const responseText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      this.logger.error(
        `카카오 토큰 API 실패 (${tokenResponse.status}): ${responseText}`,
      );
      throw new UnauthorizedException(
        `카카오 인증에 실패했습니다: ${responseText}`,
      );
    }

    let tokenData: { id_token?: string; access_token?: string };
    try {
      tokenData = JSON.parse(responseText);
    } catch {
      this.logger.error(`카카오 응답 파싱 실패: ${responseText}`);
      throw new UnauthorizedException('카카오 인증 응답을 처리할 수 없습니다.');
    }

    const idToken = tokenData.id_token;
    if (!idToken) {
      this.logger.error(
        `카카오 id_token 없음. 응답: ${JSON.stringify(tokenData)}`,
      );
      throw new UnauthorizedException(
        '카카오 ID 토큰을 받지 못했습니다. 카카오 개발자 콘솔에서 OpenID Connect를 활성화하세요.',
      );
    }

    const payload = this.decodeJwtPayload(idToken);
    const id = String(payload.sub ?? '');
    if (!id) {
      throw new UnauthorizedException('카카오 사용자 정보를 가져올 수 없습니다.');
    }
    const nickname = typeof payload.nickname === 'string' ? payload.nickname : '사용자';
    const picture =
      typeof payload.picture === 'string' ? payload.picture : null;

    return { id, nickname, picture };
  }

  private decodeJwtPayload(token: string): Record<string, unknown> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('잘못된 ID 토큰 형식입니다.');
    }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json) as Record<string, unknown>;
  }

  verifyToken(token: string): { sub: number; eventToken?: string } {
    return this.jwtService.verify(token);
  }
}
