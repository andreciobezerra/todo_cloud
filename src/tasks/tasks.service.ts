import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskRepository } from "./tasks.repository";
import {
  ICrudRepository,
  PaginatedResult,
} from "src/database/interfaces/crud-repository.interface";
import { Task, TaskPriority } from "./entities/task.entity";
import { UUID } from "crypto";
import { UsersService } from "src/users/users.service";
import { DeleteResult } from "typeorm";
import { QueryTaskDto } from "./dto/query-task.dto";

interface ITaskRepository extends ICrudRepository<Task> {
  filter(params: QueryTaskDto, userId: UUID, page?: number): Promise<PaginatedResult<Task>>;
}

@Injectable()
export class TasksService {
  private repository: ITaskRepository;

  constructor(
    repository: TaskRepository,
    private readonly userService: UsersService,
  ) {
    this.repository = repository;
  }

  async create(createTaskDto: CreateTaskDto, userId: UUID) {
    const user = await this.userService.findOne(userId);
    const task = new Task({ ...createTaskDto, priority: TaskPriority.NORMAL, user });

    return this.repository.create(task);
  }

  findAll(page?: number, userId?: UUID) {
    return this.repository.findAll(page, userId);
  }

  async findOne(id: UUID) {
    const task = await this.repository.findOneById(id);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async update(id: UUID, updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.repository.update(id, updateTaskDto as Partial<Task>);

    if (!updatedTask) {
      throw new NotFoundException("Task not found");
    }

    return updatedTask;
  }

  async remove(id: UUID) {
    const isDeleted = (await this.repository.delete(id)) as DeleteResult;

    if (!isDeleted.affected) {
      throw new NotFoundException("Task not found");
    }

    return true;
  }

  async filter(params: QueryTaskDto, userId: UUID, page?: number) {
    const { category } = params;

    delete params.category;

    const result = await this.repository.filter(params, userId, page);

    if (category) {
      result.data = result.data.filter((task) => task.categories.includes(category));
      result.total = result.data.length;
    }

    return result;
  }
}
