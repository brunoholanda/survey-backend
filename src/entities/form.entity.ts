import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { SatisfactionSurvey } from './satisfaction-survey.entity';

export enum QuestionType {
  SCALE_0_5 = 'scale_0_5',
  SCALE_0_10 = 'scale_0_10',
  TEXT_OPINION = 'text_opinion',
}

@Entity('forms')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @ManyToOne(() => Company, (company) => company.forms)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SCALE_0_10,
  })
  question_type: QuestionType;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false })
  is_optional: boolean;

  @OneToMany(() => SatisfactionSurvey, (survey) => survey.form)
  surveys: SatisfactionSurvey[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

