import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSatisfactionSurveyDto } from './create-satisfaction-survey.dto';

export class CreateMultipleSurveysDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSatisfactionSurveyDto)
  surveys: CreateSatisfactionSurveyDto[];
}

