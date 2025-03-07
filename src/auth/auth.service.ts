import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hash/hashing.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private bcrypt: HashingService,
        private jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
       
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
