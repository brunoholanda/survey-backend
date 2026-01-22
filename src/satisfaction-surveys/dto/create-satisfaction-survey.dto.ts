import { IsString, IsNotEmpty, IsInt, IsOptional, Min, Max, IsUUID, MaxLength } from 'class-validator';

export class CreateSatisfactionSurveyDto {
  @IsUUID()
  @IsNotEmpty()
  form_id: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  scale_value?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  text_response?: string;
}

