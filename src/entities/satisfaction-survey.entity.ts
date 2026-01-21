import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Form } from './form.entity';

@Entity('satisfaction_surveys')
export class SatisfactionSurvey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  form_id: string;

  @ManyToOne(() => Form, (form) => form.surveys)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @Column({ type: 'int', nullable: true })
  scale_value: number;

  @Column({ type: 'text', nullable: true })
  text_response: string;

  @CreateDateColumn()
  created_at: Date;
}

