import { IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFormDto } from './create-form.dto';

export class CreateMultipleFormsDto {
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CreateFormDto)
  forms: CreateFormDto[];
}

