import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { TaskService } from "../task/task.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { TaskDto } from "./dto/task.dto";

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.taskService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createTask(@CurrentUser("id") userId: string, @Body() dto: TaskDto) {
    return this.taskService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateTask(
    @Body() dto: TaskDto,
    @CurrentUser('id') userId : string,
    @Param('id') id : string)
  {
    return this.taskService.update(dto, id, userId)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id)
  }
}
