import {  IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString({ message: 'Nome precisa ser um texto' })
    @IsNotEmpty({ message: 'Nome não pode ser vazio' })
    name: string;

    @IsString({ message: 'Email precisa ser um texto' })
    @IsNotEmpty({ message: 'Email não pode ser vazio' })
    email: string;

    @IsString({ message: 'Senha precisa ser um texto' })
    @IsNotEmpty({ message: 'Senha não pode ser vazio' })
    @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
    password: string;
}
