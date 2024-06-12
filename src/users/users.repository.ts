import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, QueryRunner } from "typeorm";
import {
  ICrudRepository,
  PaginatedResult,
} from "src/database/interfaces/crud-repository.interface";
import { UUID } from "crypto";
import { PER_PAGE } from "src/database/database.config";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersRepository implements ICrudRepository<User> {
  queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async create(payload: Omit<User, ("createdAt" | "updatedAt") | "id">): Promise<User | void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const newUser = await this.queryRunner.manager.save(payload as User);

      await this.queryRunner.commitTransaction();

      return newUser;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();

      throw err;
    }
  }

  findOneById(id: UUID): Promise<User> {
    return this.dataSource.getRepository(User).createQueryBuilder("users").where({ id }).getOne();
  }

  async findAll(_, page?: number): Promise<PaginatedResult<User>> {
    const [data, total] = page
      ? await this.dataSource
          .getRepository(User)
          .createQueryBuilder("users")
          .skip(PER_PAGE * page)
          .take(PER_PAGE)
          .getManyAndCount()
      : await this.dataSource.getRepository(User).createQueryBuilder("users").getManyAndCount();

    return { data, total, page };
  }

  async update(id: UUID, payload: Partial<User>): Promise<User> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      await this.queryRunner.manager.update(User, { id }, payload as User);
      await this.queryRunner.commitTransaction();

      return this.findOneById(id);
    } catch (err) {
      this.queryRunner.rollbackTransaction();

      throw err;
    }
  }

  async delete(id: UUID): Promise<DeleteResult> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    return this.queryRunner.manager
      .delete(User, { id })
      .catch((err) => {
        this.queryRunner.rollbackTransaction();

        throw err;
      })
      .finally(() => this.queryRunner.release());
  }

  async find(options: Partial<User>) {
    return this.dataSource.getRepository(User).createQueryBuilder("users").where(options).getMany();
  }

  async emailInUse(email: string): Promise<boolean> {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder("users")
      .where({ email })
      .getExists();
  }
}
