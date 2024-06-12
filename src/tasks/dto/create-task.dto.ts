import { MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
  @MinLength(3)
  @MaxLength(128)
  title: string;

  @MinLength(3)
  @MaxLength(300)
  description: string;
}
