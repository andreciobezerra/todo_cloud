import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepository } from "./users.repository";
import { ICrudRepository } from "src/database/interfaces/crud-repository.interface";
import { User } from "./entities/user.entity";
import { UUID } from "crypto";
import * as bcrypt from "bcrypt";
import { DeleteResult } from "typeorm";

interface IUserRepository extends ICrudRepository<User> {
  find(partial: Partial<User>): Promise<Array<User>>;
  emailInUse(email: string): Promise<boolean>;
}

@Injectable()
export class UsersService {
  private readonly usersRepository: IUserRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async create(createUserDto: CreateUserDto) {
    const emailInUse = await this.usersRepository.emailInUse(createUserDto.email);

    if (emailInUse) {
      throw new BadRequestException("Email already in use");
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    try {
      return await this.usersRepository.create(new User({ tasks: [], ...createUserDto }));
    } catch (err) {
      throw new InternalServerErrorException({ message: err.message ?? "Internal error" });
    }
  }

  findAll(page?: number) {
    return this.usersRepository.findAll(page);
  }

  async findOne(id: UUID) {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }

    return user;
  }

  find(options: Partial<User>) {
    return this.usersRepository.find(options);
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException({ message: "User not found" });
    }

    return user;
  }

  async remove(id: UUID) {
    const isDeleted = (await this.usersRepository.delete(id)) as DeleteResult;

    if (!isDeleted.affected) {
      throw new NotFoundException("Task not found");
    }

    return true;
  }
}
