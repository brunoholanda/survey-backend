import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatisfactionSurveysService } from './satisfaction-surveys.service';
import { SatisfactionSurveysController } from './satisfaction-surveys.controller';
import { SatisfactionSurvey } from '../entities/satisfaction-survey.entity';
import { Form } from '../entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SatisfactionSurvey, Form])],
  controllers: [SatisfactionSurveysController],
  providers: [SatisfactionSurveysService],
  exports: [SatisfactionSurveysService],
})
export class SatisfactionSurveysModule {}

