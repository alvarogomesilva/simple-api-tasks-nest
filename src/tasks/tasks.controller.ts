import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD } from 'src/auth/constants/auth.constants';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)

  create(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    return this.tasksService.create(createTaskDto, tokenPayloadParam);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {

    return this.tasksService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {

    return this.tasksService.update(+id, updateTaskDto, tokenPayloadParam);
  }

  
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    return this.tasksService.remove(+id, tokenPayloadParam);
  }
}
