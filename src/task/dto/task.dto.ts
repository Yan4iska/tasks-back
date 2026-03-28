import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class TaskDto   {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean

  @ApiProperty()
  @IsString()
  @IsOptional()
  createdAt?: string

  @ApiProperty()
  @IsEnum(Priority)
  @IsOptional()
  @Transform(({value})=> ('' + value).toLowerCase())
  priority?: Priority
}


