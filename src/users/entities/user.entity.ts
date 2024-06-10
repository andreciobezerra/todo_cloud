/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exclude } from "class-transformer";
import { UUID } from "crypto";

export class User {
  public createdAt: Date;
  public updatedAt?: Date;
  public id: UUID;
  public name: string;
  public email: string;

  @Exclude()
  public password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class UserNotFound extends Error {}
