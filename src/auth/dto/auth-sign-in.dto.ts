import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthSignInDto {

    @IsString({ message: 'Email precisa ser um texto' })
    @IsNotEmpty({ message: 'Email não pode ser vazio' })
    email: string;

    @IsString({ message: 'Senha precisa ser um texto' })
    @IsNotEmpty({ message: 'Senha não pode ser vazio' })
    @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
    password: string;
}