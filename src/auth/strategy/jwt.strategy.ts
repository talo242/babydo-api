import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { PrismaService } from '../../prisma/prisma.service';
import { AUTH_TOKEN_COOKIE_KEY } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    const { hash: _, ...userWithoutHash } = user;
    return userWithoutHash;
  }

  private static extractJwtFromCookie(req: Request) {
    if (req && req.cookies[AUTH_TOKEN_COOKIE_KEY]) {
      return req.cookies[AUTH_TOKEN_COOKIE_KEY];
    }

    return null;
  }
}
