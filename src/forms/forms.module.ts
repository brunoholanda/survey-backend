import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form } from '../entities/form.entity';
import { Company } from '../entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Company])],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}

