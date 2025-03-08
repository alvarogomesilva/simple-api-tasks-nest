import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashingService } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingService, useClass: BcryptService }
  ],
  exports: [
    HashingService,
    JwtModule,
    ConfigModule
  ]
})
export class AuthModule {}
