import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './hash/bcrypt.service';
import { HashingService } from './hash/hashing.service';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private bcrypt: HashingService,
        private jwtService: JwtService
    ) { }

    async signIn(signInDto: AuthSignInDto): Promise<any> {

        const user = await this.prisma.user.findFirst({
            where: {
                email: signInDto.email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Usuario/senha incorretos');
        }

        const isMatch = await this.bcrypt.compare(signInDto.password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException('Usuario/senha incorretos');
        }

        const payload = { sub: user.id, email: user.email };

        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
