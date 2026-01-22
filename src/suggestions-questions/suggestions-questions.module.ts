import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuggestionsQuestionsService } from './suggestions-questions.service';
import { SuggestionsQuestionsController } from './suggestions-questions.controller';
import { SuggestionQuestion } from '../entities/suggestion-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuggestionQuestion])],
  controllers: [SuggestionsQuestionsController],
  providers: [SuggestionsQuestionsService],
  exports: [SuggestionsQuestionsService],
})
export class SuggestionsQuestionsModule {}



