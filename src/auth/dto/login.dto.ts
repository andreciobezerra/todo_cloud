import { IsEmail, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @MaxLength(64)
  email: string;

  @MinLength(8)
  password: string;
}
