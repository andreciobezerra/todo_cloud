import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepository } from "./users.repository";
import { ICrudRepository } from "src/database/interfaces/crud-repository.interface";
import { User } from "./entities/user.entity";
import { UUID } from "crypto";
import * as bcrypt from "bcrypt";

interface IUsersRepository extends ICrudRepository<User> {
  emailInUse(email: string): boolean;
}

@Injectable()
export class UsersService {
  private readonly usersRepository: IUsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async create(createUserDto: CreateUserDto) {
    if (this.usersRepository.emailInUse) {
      throw new Error("Email already in use"); //TODO
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    try {
      return await this.usersRepository.create(createUserDto);
    } catch (err) {
      console.log(err); //TODO
    }
  }

  findAll(page?: number) {
    return this.usersRepository.findAll(page);
  }

  async findOne(id: UUID) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new Error("User not found"); //TODO
    }

    return user;
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update(id, updateUserDto);

    if (!user) {
      throw new Error("User not found"); //TODO
    }

    return user;
  }

  async remove(id: UUID) {
    const user = await this.usersRepository.delete(id);

    if (!user) {
      throw new Error("User not found"); //TODO
    }

    return user;
  }
}
