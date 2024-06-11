import { User } from "./entities/user.entity";
import { Injectable } from "@nestjs/common";
import { UUID, randomUUID } from "crypto";
import { CreateUserDto } from "./dto/create-user.dto";
import { PER_PAGE } from "src/database/database.config";
import { ICrudRepository } from "src/database/interfaces/crud-repository.interface";

const usersDB = new Map<UUID, User>();

@Injectable()
export class UsersRepository implements ICrudRepository<User> {
  create(payload: CreateUserDto): Promise<User> {
    const id = randomUUID();
    const userToSave = new User({ id, ...payload });
    userToSave.createdAt = new Date();

    return Promise.resolve(userToSave);
  }

  findOne(id: UUID): Promise<User> {
    return Promise.resolve(usersDB.get(id));
  }

  findAll(page?: number): Promise<User[]> {
    const users = usersDB.values();
    const paginatedResult = page
      ? Array.from(users).slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
      : Array.from(users);

    return Promise.resolve(paginatedResult);
  }

  update(id: UUID, payload: Partial<User>): Promise<User> {
    const user = usersDB.get(id);

    if (!user) {
      return null;
    }

    const updatedUser = {
      ...user,
      ...payload,
      updatedAt: new Date(),
    };

    usersDB.set(id, updatedUser);

    return Promise.resolve(updatedUser);
  }

  delete(id: UUID): Promise<User> {
    const user = usersDB.get(id);

    if (!user) {
      return null;
    }

    usersDB.delete(id);

    return Promise.resolve(user);
  }

  emailInUse(email: string): boolean {
    return Array.from(usersDB.values()).some((user: User) => user.email == email);
  }
}
