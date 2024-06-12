import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UUID } from "crypto";
import { TaskOwnerGuard } from "./guards/task-owner.guard";
import { QueryTaskDto } from "./dto/query-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, req.userId);
  }

  @Get()
  findAll(@Req() req: any, @Query("page", new ParseIntPipe({ optional: true })) page?: number) {
    return this.tasksService.findAll(page, req.userId);
  }

  @Get(":id")
  @UseGuards(TaskOwnerGuard)
  findOne(@Param("id", new ParseUUIDPipe()) id: UUID) {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(TaskOwnerGuard)
  update(@Param("id", new ParseUUIDPipe()) id: UUID, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  @UseGuards(TaskOwnerGuard)
  remove(@Param("id", new ParseUUIDPipe()) id: UUID) {
    return this.tasksService.remove(id);
  }

  @Get("filter")
  filter(
    @Req() req: any,
    @Query() query: QueryTaskDto,
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
  ) {
    return this.tasksService.filter(query, req.userId, page);
  }
}
