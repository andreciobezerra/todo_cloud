import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, QueryRunner } from "typeorm";
import { Task } from "./entities/task.entity";
import {
  ICrudRepository,
  PaginatedResult,
} from "src/database/interfaces/crud-repository.interface";
import { UUID } from "crypto";
import { PER_PAGE } from "src/database/database.config";

@Injectable()
export class TaskRepository implements ICrudRepository<Task> {
  queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async create(payload: Omit<Task, ("createdAt" | "updatedAt") | "id">): Promise<Task | void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    return this.queryRunner.manager
      .save(payload as Task)
      .catch((err) => {
        this.queryRunner.rollbackTransaction();

        throw err;
      })
      .finally(() => this.queryRunner.release());
  }

  findOneById(id: UUID, userId: UUID): Promise<Task> {
    return this.dataSource
      .getRepository(Task)
      .createQueryBuilder("tasks")
      .where({ id })
      .andWhere({ user: { id: userId } })
      .getOne();
  }

  async findAll(userId: UUID, page?: number): Promise<PaginatedResult<Task>> {
    const [data, total] = page
      ? await this.dataSource
          .getRepository(Task)
          .createQueryBuilder("tasks")
          .skip(PER_PAGE * page)
          .take(PER_PAGE)
          .where({ user: { id: userId } })
          .getManyAndCount()
      : await this.dataSource
          .getRepository(Task)
          .createQueryBuilder("task")
          .where({ user: { id: userId } })
          .getManyAndCount();

    return { data, total, page };
  }

  async update(id: UUID, payload: Partial<Task>, userId: UUID): Promise<Task> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    return this.queryRunner.manager
      .update(Task, { id, user: { id: userId } }, payload as Task)
      .then(() => this.findOneById(id, userId))
      .catch((err) => {
        this.queryRunner.rollbackTransaction();

        throw err;
      })
      .finally(() => this.queryRunner.release());
  }

  async delete(id: UUID, userId: UUID): Promise<DeleteResult> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    return this.queryRunner.manager
      .delete(Task, { id, user: { id: userId } })
      .catch((err) => {
        this.queryRunner.rollbackTransaction();

        throw err;
      })
      .finally(() => this.queryRunner.release());
  }
}
