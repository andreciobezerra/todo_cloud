import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TasksService } from "src/tasks/tasks.service";

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private readonly taskService: TasksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const paramsId = request.params.id;
    const task = await this.taskService.findOne(paramsId);

    return task?.user?.id == userId;
  }
}
