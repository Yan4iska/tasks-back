import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { TimeBlockService } from "../time-block/time-block.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { TimeBlockDto } from "./dto/time-block.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";


@Controller('user/time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.timeBlockService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@CurrentUser("id") userId: string, @Body() dto: TimeBlockDto) {
    return this.timeBlockService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-order')
  @Auth()
   updateTimeBlock(
    @Body() updateOrderDto: UpdateOrderDto)
  {
    return this.timeBlockService.updateOrder(updateOrderDto.ids)
  }


  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update (@CurrentUser('id') userId: string, @Body() dto: TimeBlockDto, @Param('id') id: string) {
    return this.timeBlockService.update(id, userId, dto)
  }
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.timeBlockService.delete(id, userId)
  }
}
