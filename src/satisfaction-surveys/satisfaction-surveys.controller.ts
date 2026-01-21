import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SatisfactionSurveysService } from './satisfaction-surveys.service';
import { CreateSatisfactionSurveyDto } from './dto/create-satisfaction-survey.dto';
import { CreateMultipleSurveysDto } from './dto/create-multiple-surveys.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('satisfaction-surveys')
export class SatisfactionSurveysController {
  constructor(
    private readonly satisfactionSurveysService: SatisfactionSurveysService,
  ) {}

  @Post()
  create(@Body() createSurveyDto: CreateSatisfactionSurveyDto) {
    return this.satisfactionSurveysService.create(createSurveyDto);
  }

  @Post('multiple')
  createMultiple(@Body() createMultipleSurveysDto: CreateMultipleSurveysDto) {
    return this.satisfactionSurveysService.createMultiple(createMultipleSurveysDto);
  }

  @Get('form/:formId')
  findAllByForm(@Param('formId') formId: string) {
    return this.satisfactionSurveysService.findAllByForm(formId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company')
  findAllByCompany(@Request() req) {
    return this.satisfactionSurveysService.findAllByCompany(req.user.company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/statistics')
  getStatisticsByCompany(@Request() req) {
    return this.satisfactionSurveysService.getStatisticsByCompany(req.user.company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('session/:surveyId')
  getResponsesBySession(@Param('surveyId') surveyId: string, @Request() req) {
    return this.satisfactionSurveysService.getResponsesBySession(surveyId, req.user.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.satisfactionSurveysService.findOne(id);
  }
}

