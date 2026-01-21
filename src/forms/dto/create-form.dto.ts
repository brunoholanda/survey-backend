import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { QuestionType } from '../../entities/form.entity';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEnum(QuestionType)
  question_type: QuestionType;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  is_optional?: boolean;
}

