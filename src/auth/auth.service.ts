import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService
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

        const isMatch = compareSync(signInDto.password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException('Usuario/senha incorretos');
        }



        return { ok: true };
    }
}
