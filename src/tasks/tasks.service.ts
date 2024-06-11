import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskRepository } from "./tasks.repository";
import { ICrudRepository } from "src/database/interfaces/crud-repository.interface";
import { Task, TaskPriority } from "./entities/task.entity";
import { UUID } from "crypto";
import { UsersService } from "src/users/users.service";
import { DeleteResult } from "typeorm";

@Injectable()
export class TasksService {
  private repository: ICrudRepository<Task>;

  constructor(
    repository: TaskRepository,
    private readonly userService: UsersService,
  ) {
    this.repository = repository;
  }

  async create(createTaskDto: CreateTaskDto, userId: UUID) {
    const user = await this.userService.findOne(userId);
    const task = new Task({ ...createTaskDto, priotity: TaskPriority.NORMAL, user });

    return this.repository.create(task);
  }

  findAll(userId: UUID, page?: number) {
    return this.repository.findAll(userId, page);
  }

  async findOne(id: UUID, userId: UUID) {
    const task = await this.repository.findOneById(id, userId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async update(id: UUID, updateTaskDto: UpdateTaskDto, userId: UUID) {
    const updatedTask = await this.repository.update(id, updateTaskDto, userId);

    if (!updatedTask) {
      throw new NotFoundException("Task not found");
    }

    return updatedTask;
  }

  async remove(id: UUID, userId: UUID) {
    const isDeleted = (await this.repository.delete(id, userId)) as DeleteResult;

    if (isDeleted.affected) {
      throw new NotFoundException("Task not found");
    }

    return true;
  }
}
