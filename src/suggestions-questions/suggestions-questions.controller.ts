import { Controller, Get, Query } from '@nestjs/common';
import { SuggestionsQuestionsService } from './suggestions-questions.service';

@Controller('suggestions-questions')
export class SuggestionsQuestionsController {
  constructor(
    private readonly suggestionsQuestionsService: SuggestionsQuestionsService,
  ) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.suggestionsQuestionsService.findAll(category);
  }
}


