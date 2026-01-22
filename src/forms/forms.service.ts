import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form, QuestionType } from '../entities/form.entity';
import { Company } from '../entities/company.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(companyId: string, createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create({
      ...createFormDto,
      company_id: companyId,
    });

    return this.formRepository.save(form);
  }

  async hasForm(companyId: string): Promise<boolean> {
    const count = await this.formRepository.count({
      where: { company_id: companyId },
    });
    return count > 0;
  }

  async createMultiple(companyId: string, createFormsDto: CreateFormDto[]): Promise<Form[]> {
    // Verificar se a empresa já possui um formulário
    const hasExistingForm = await this.hasForm(companyId);
    if (hasExistingForm) {
      throw new BadRequestException('A empresa já possui um formulário de pesquisa. Cada empresa pode ter apenas um formulário.');
    }

    if (createFormsDto.length > 20) {
      throw new BadRequestException('Máximo de 20 perguntas permitidas');
    }

    const forms = createFormsDto.map((dto, index) =>
      this.formRepository.create({
        ...dto,
        company_id: companyId,
        order: index,
      }),
    );

    return this.formRepository.save(forms);
  }

  async findAllByCompany(companyId: string): Promise<Form[]> {
    return this.formRepository.find({
      where: { company_id: companyId },
      order: { order: 'ASC' },
    });
  }

  async findPublicByCompanyId(companyId: string): Promise<Partial<Form>[]> {
    // Verificar se a empresa existe
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Buscar formulários da empresa
    const forms = await this.formRepository.find({
      where: { company_id: companyId },
      order: { order: 'ASC' },
      select: ['id', 'question', 'question_type', 'order', 'is_optional'],
    });

    return forms;
  }

  async findOne(id: string, companyId: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    return form;
  }

  async update(id: string, companyId: string, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.findOne(id, companyId);
    Object.assign(form, updateFormDto);
    return this.formRepository.save(form);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const form = await this.findOne(id, companyId);
    await this.formRepository.remove(form);
  }

  async removeAllByCompany(companyId: string): Promise<void> {
    const forms = await this.findAllByCompany(companyId);
    await this.formRepository.remove(forms);
  }
}

