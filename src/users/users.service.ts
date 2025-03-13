import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {

    const saltOrRounds = 10;
    const hash = hashSync(createUserDto.password, saltOrRounds);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hash
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto, tokenPayloadParam: PayloadTokenDto) {
    const findUser = await this.prisma.user.findFirst({ where: { id: id } })

    if (findUser.id !== tokenPayloadParam.sub) {
      throw new UnauthorizedException('Não pode atualizar esse usuário')
    }

    const user = await this.prisma.user.update({
      where: { id: tokenPayloadParam.sub },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
   
    return user
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
