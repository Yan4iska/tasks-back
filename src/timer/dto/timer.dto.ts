import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";



export class TimerSessionDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean
}

export class TimerRoundDto {
  @ApiProperty()
  @IsNumber()
  totalSeconds: number

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean
}


