/* eslint-disable @typescript-eslint/no-unused-vars */
import { UUID } from "crypto";

export class User {
  public createdAt: Date;
  public updatedAt?: Date;

  constructor(
    public id: UUID,
    public name: string,
    public email: string,
    public password: string,
  ) {}
}

export class UserNotFound extends Error {}
