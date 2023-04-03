import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { AuthDto } from './dto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupLocal(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    const { hash: _, ...userWithoutHash } = user;

    return userWithoutHash;
  }

  loginLocal() {
    return 'loginLocal';
  }
}
