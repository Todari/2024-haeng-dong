import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

  async loginWithKakao(code: string) {
    // Kakao OAuth flow placeholder - implement with actual Kakao API
    // For now, return a structure that matches expected behavior
    const kakaoUser = await this.getKakaoUserInfo(code);

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
      token: this.jwtService.sign({ sub: user.id }),
    };
  }

  private async getKakaoUserInfo(
    _code: string,
  ): Promise<{ id: string; nickname: string; picture: string | null }> {
    // TODO: Implement actual Kakao OAuth token exchange and user info retrieval
    throw new Error('Kakao OAuth not yet implemented');
  }

  verifyToken(token: string): { sub: number; eventToken?: string } {
    return this.jwtService.verify(token);
  }
}
