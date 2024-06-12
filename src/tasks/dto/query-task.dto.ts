import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional } from "class-validator";
import { TaskCategory, TaskPriority } from "../entities/task.entity";
import { Transform } from "class-transformer";

export class QueryTaskDto {
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsIn(Object.values(TaskPriority))
  priority?: TaskPriority;

  @IsOptional()
  @IsIn(Object.values(TaskCategory))
  category?: TaskCategory;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    }
    return value;
  })
  completed?: boolean;

  @IsOptional()
  @IsInt()
  evaluation?: number;
}
