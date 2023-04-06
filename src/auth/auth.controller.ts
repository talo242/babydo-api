import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AUTH_TOKEN_COOKIE_KEY } from './constants';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signupLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const { access_token } = await this.authService.signupLocal(dto);

    res
      .cookie(AUTH_TOKEN_COOKIE_KEY, access_token, cookieOptions)
      .send({ status: 'ok' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const { access_token } = await this.authService.loginLocal(dto);

    res
      .cookie(AUTH_TOKEN_COOKIE_KEY, access_token, cookieOptions)
      .send({ status: 'ok' });
  }
}
