import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuggestionQuestion } from '../entities/suggestion-question.entity';

@Injectable()
export class SuggestionsQuestionsService {
  constructor(
    @InjectRepository(SuggestionQuestion)
    private suggestionQuestionRepository: Repository<SuggestionQuestion>,
  ) {}

  async findAll(category?: string): Promise<SuggestionQuestion[]> {
    const where = category ? { category } : {};
    return this.suggestionQuestionRepository.find({
      where,
      order: { created_at: 'ASC' },
    });
  }
}




