import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';

@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    signIn(@Body() signInDto: AuthSignInDto) {
      return this.authService.signIn(signInDto);
    }

}
