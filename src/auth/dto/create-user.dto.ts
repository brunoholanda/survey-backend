import { IsString, IsNotEmpty, MinLength, IsInt, IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsIn([1, 2])
  user_type: number;

  @IsUUID()
  @IsOptional()
  company_id?: string;
}



