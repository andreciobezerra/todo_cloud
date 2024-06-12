import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, QueryRunner } from "typeorm";
import { Task } from "./entities/task.entity";
import {
  ICrudRepository,
  PaginatedResult,
} from "src/database/interfaces/crud-repository.interface";
import { UUID } from "crypto";
import { PER_PAGE } from "src/database/database.config";
import { QueryTaskDto } from "./dto/query-task.dto";

@Injectable()
export class TaskRepository implements ICrudRepository<Task> {
  queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async create(payload: Omit<Task, ("createdAt" | "updatedAt") | "id">): Promise<Task | void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const newTask = await this.queryRunner.manager.save(payload as Task);
      await this.queryRunner.commitTransaction();

      return newTask;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();

      throw err;
    }
  }

  findOneById(id: UUID): Promise<Task> {
    return this.dataSource
      .getRepository(Task)
      .createQueryBuilder("tasks")
      .where({ id })
      .leftJoinAndSelect("tasks.user", "user")
      .getOne();
  }

  async findAll(page?: number, userId?: UUID): Promise<PaginatedResult<Task>> {
    const [data, total] = page
      ? await this.dataSource
          .getRepository(Task)
          .createQueryBuilder("tasks")
          .skip(PER_PAGE * page)
          .take(PER_PAGE)
          .where({ user: { id: userId } })
          .leftJoinAndSelect("tasks.user", "user")
          .getManyAndCount()
      : await this.dataSource
          .getRepository(Task)
          .createQueryBuilder("tasks")
          .where({ user: { id: userId } })
          .leftJoinAndSelect("tasks.user", "user")
          .getManyAndCount();

    return { data, total, page };
  }

  async update(id: UUID, payload: Partial<Task>): Promise<Task> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      await this.queryRunner.manager.update(Task, { id }, payload as Task);
      await this.queryRunner.commitTransaction();

      return this.findOneById(id);
    } catch (err) {
      await this.queryRunner.rollbackTransaction();

      throw err;
    }
  }

  async delete(id: UUID): Promise<DeleteResult> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const result = await this.queryRunner.manager.delete(Task, { id });
      await this.queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();

      throw err;
    }
  }

  async filter(params: QueryTaskDto, userId: UUID, page?: number) {
    const [data, total] = page
      ? await this.dataSource
          .getRepository(Task)
          .createQueryBuilder("tasks")
          .skip(PER_PAGE * page)
          .take(PER_PAGE)
          .where({ user: { id: userId } })
          .andWhere(params)
          .leftJoinAndSelect("tasks.user", "user")
          .getManyAndCount()
      : await this.dataSource
          .getRepository(Task)
          .createQueryBuilder("tasks")
          .where({ user: { id: userId } })
          .andWhere(params)
          .leftJoinAndSelect("tasks.user", "user")
          .getManyAndCount();

    return { data, total, page };
  }
}
