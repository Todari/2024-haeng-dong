import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  eventToken?: string;
  role?: string;
}

const ACCESS_TOKEN_COOKIE = 'accessToken';

function jwtExtractor(req: Request): string | null {
  const fromCookie = req?.cookies?.[ACCESS_TOKEN_COOKIE];
  if (fromCookie) return fromCookie;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'haengdong-secret-key',
      ),
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, eventToken: payload.eventToken, role: payload.role };
  }
}
