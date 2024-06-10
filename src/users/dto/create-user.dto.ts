import { IsEmail, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @MaxLength(64)
  @MinLength(3)
  name: string;

  @IsEmail()
  @MaxLength(64)
  email: string;

  @MinLength(8)
  password: string;
}
