import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { AuthResponse } from './model';
import { AUTH_TOKEN_COOKIE_KEY } from './constants';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
};

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => AuthResponse)
  async loginLocal(
    @Context() context,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string
  ) {
    const { access_token } = await this.authService.loginLocal({
      email,
      password,
    });

    context.res.cookie(AUTH_TOKEN_COOKIE_KEY, access_token, cookieOptions);
    return { status: 'ok' };
  }

  @Mutation(() => AuthResponse)
  async signupLocal(
    @Context() context,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string
  ) {
    const { access_token } = await this.authService.signupLocal({
      email,
      password,
    });

    context.res.cookie(AUTH_TOKEN_COOKIE_KEY, access_token, cookieOptions);
    return { status: 'ok' };
  }
}
