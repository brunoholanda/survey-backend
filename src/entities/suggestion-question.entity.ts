import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionType } from './form.entity';

@Entity('suggestions_questions')
export class SuggestionQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SCALE_0_10,
  })
  question_type: QuestionType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}



