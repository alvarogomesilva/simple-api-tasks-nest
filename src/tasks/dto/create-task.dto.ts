import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {

    @IsString({ message: 'Nome precisa ser um texto' })
    @IsNotEmpty({ message: 'Nome não pode ser vazio!' })
    name: string;

    @IsString({ message: 'Descrição precisa ser um texto' })
    @IsNotEmpty({ message: 'Descrição não pode ser vazio' })
    description: string;

    @IsNotEmpty({ message: 'Usuário inválido' })
    userId: number;
}
