import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min, Max, IsEmail, MinLength, IsString } from "class-validator";



export class PomodoroSettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  workInterval?: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  breakInterval?: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  intervalsCount?: number
}

export class UserDto extends PomodoroSettingsDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string

  @ApiProperty()
  @IsOptional()
  @MinLength(6, {
    message: "Password must be at least 6 characters long"
  })

  @ApiProperty()
  @IsString()
  @IsOptional() 
  password?: string
}


