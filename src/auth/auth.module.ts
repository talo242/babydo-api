import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
