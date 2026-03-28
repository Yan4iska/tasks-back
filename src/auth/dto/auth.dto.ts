import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class AuthDto {
  @ApiProperty()
  @IsEmail()
  email: string
  @ApiProperty()
  @MinLength(6, {
    message: "Password must be at least 6 characters long"
  })
  @IsString()
  password: string
}