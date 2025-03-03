import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false
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

    if(allTasks.length > 0) return allTasks;

    throw new HttpException('Nenhuma tarefa cadastrada!', HttpStatus.NOT_FOUND)
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: id }
    })

    if(task?.name) return task;

    throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND)
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    
    const findTask = await this.prisma.task.findFirst({
      where: { id: id }
    })

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

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
