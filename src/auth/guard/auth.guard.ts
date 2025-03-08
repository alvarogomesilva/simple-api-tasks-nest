import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD } from "../constants/auth.constants";



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
    
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
        
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractTokenHeader(request)


        if (!token) {
            throw new UnauthorizedException('Acesso não autorizado')
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration)
            
            request[REQUEST_TOKEN_PAYLOAD] = payload

        } catch (error) {
            console.log(error)
            throw new UnauthorizedException('Acesso não autorizado')
        }

        return true

    }

    extractTokenHeader(request: Request) {
        const authorization = request.headers?.authorization

        if (!authorization || typeof authorization !== 'string') {
            throw new UnauthorizedException('Token não encontrado')
        }

        return authorization.split(' ')[1];
    }
}