import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService
    ) { }

    async signIn(email: string, password: string): Promise<any> {

        const user = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Usuario/senha incorretos');
        }

        const isMatch = compareSync(password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException('Usuario/senha incorretos');
        }



        return { ok: true };
    }
}
