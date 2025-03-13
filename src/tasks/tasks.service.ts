import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto, tokenPayloadParam: PayloadTokenDto) {

    if (!tokenPayloadParam.sub) {
      throw new UnauthorizedException('Usuário inválido!')
    }

    const task = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false,
        userId: tokenPayloadParam.sub
      }
    })

    return task;
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset
    });

    if (allTasks.length > 0) return allTasks;

    throw new HttpException('Nenhuma tarefa cadastrada!', HttpStatus.NOT_FOUND)
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: id }
    })

    if (task?.name) return task;

    throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND)
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, tokenPayloadParam: PayloadTokenDto) {
    const findTask = await this.prisma.task.findFirst({
      where: { id: id }
    })

    if (findTask.userId !== tokenPayloadParam.sub) {
      throw new HttpException('Não pode atualizar essa tarefa!', HttpStatus.UNAUTHORIZED)
    }

    if (!findTask) {
      throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND)
    }

    const task = await this.prisma.task.update({
      where: { id: id },
      data: {
        name: updateTaskDto.name,
        description: updateTaskDto.description,
        completed: updateTaskDto.completed
      }
    })

    return task;

  }

  async remove(id: number, tokenPayloadParam: PayloadTokenDto) {

    const findTask = await this.prisma.task.findFirst({ 
      where: { userId: tokenPayloadParam.sub }
    })

    if (!findTask) {
      throw new HttpException('Não pode excluir essa tarefa!', HttpStatus.UNAUTHORIZED)
    }

    if (findTask.id !== id) {
      throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND)
    }

    const task = await this.prisma.task.delete({ where: { id: id } })
    

    return task;
  }
}
