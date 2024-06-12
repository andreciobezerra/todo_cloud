import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional } from "class-validator";
import { TaskCategory, TaskPriority } from "../entities/task.entity";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsIn(Object.values(TaskPriority))
  priority: TaskPriority;

  @IsOptional()
  @IsInt()
  evaluation: number;

  @IsOptional()
  @IsIn(Object.values(TaskCategory), { each: true })
  categories: Array<TaskCategory>;
}
