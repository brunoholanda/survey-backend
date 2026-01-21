import { IsString, IsNotEmpty, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateSatisfactionSurveyDto {
  @IsString()
  @IsNotEmpty()
  form_id: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  scale_value?: number;

  @IsString()
  @IsOptional()
  text_response?: string;
}

