import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UUID, randomUUID } from "crypto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, randomUUID());
  }

  @Get()
  findAll() {
    return this.tasksService.findAll(randomUUID());
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: UUID) {
    return this.tasksService.findOne(id, randomUUID());
  }

  @Patch(":id")
  update(@Param("id", new ParseUUIDPipe()) id: UUID, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto, randomUUID());
  }

  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: UUID) {
    return this.tasksService.remove(id, randomUUID());
  }
}
