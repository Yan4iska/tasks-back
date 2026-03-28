import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { TimerRoundDto, TimerSessionDto } from "./dto/timer.dto";
import { TimerService } from "./timer.service";

@Controller('user/timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('today')
  @Auth()
  async getTodaySession(@CurrentUser('id') userId:string){
    return this.timerService.getTodaySession(userId)
  }

  @Auth()
  @HttpCode(200)
  @Post()
  async create(@CurrentUser('id') userId:string) {
    return this.timerService.create(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('round/:id')
  async updateRound (@Body() dto: TimerRoundDto, @Param('id') id:string) {
    return this.timerService.updateRound(dto, id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update (@Body() dto: TimerSessionDto,@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.timerService.update(dto, userId, id)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async deleteSession(@Param('id') sessionId: string, @CurrentUser('id') userId: string) {
    return this.timerService.deleteSession(sessionId, userId)
  }
}
