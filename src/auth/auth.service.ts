import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { AuthDto } from './dto';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupLocal(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      const { hash: _, ...userWithoutHash } = user;

      return userWithoutHash;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already in use');
        }

        throw error;
      }
    }
  }

  async loginLocal(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const passwordValid = await argon.verify(user.hash, dto.password);

    if (!passwordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const { hash: _, ...userWithoutHash } = user;

    return userWithoutHash;
  }
}
