import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SatisfactionSurvey } from '../entities/satisfaction-survey.entity';
import { Form } from '../entities/form.entity';
import { CreateSatisfactionSurveyDto } from './dto/create-satisfaction-survey.dto';
import { CreateMultipleSurveysDto } from './dto/create-multiple-surveys.dto';

@Injectable()
export class SatisfactionSurveysService {
  constructor(
    @InjectRepository(SatisfactionSurvey)
    private surveyRepository: Repository<SatisfactionSurvey>,
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {}

  async create(createSurveyDto: CreateSatisfactionSurveyDto): Promise<SatisfactionSurvey> {
    const form = await this.formRepository.findOne({
      where: { id: createSurveyDto.form_id },
    });

    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    const survey = this.surveyRepository.create(createSurveyDto);
    return this.surveyRepository.save(survey);
  }

  async createMultiple(createMultipleSurveysDto: CreateMultipleSurveysDto) {
    // Criar uma sessão única para agrupar as respostas
    const sessionId = randomUUID();

    const surveys = await Promise.all(
      createMultipleSurveysDto.surveys.map(async (survey) => {
        // Validar se o form existe
        const form = await this.formRepository.findOne({
          where: { id: survey.form_id },
        });

        if (!form) {
          throw new NotFoundException(`Formulário ${survey.form_id} não encontrado`);
        }

        // Validar tipo de resposta
        if (form.question_type === 'text_opinion' && !survey.text_response) {
          throw new BadRequestException('Resposta de texto é obrigatória para este tipo de pergunta');
        }

        if (form.question_type !== 'text_opinion' && survey.scale_value === undefined) {
          throw new BadRequestException('Valor de escala é obrigatório para este tipo de pergunta');
        }

        // Validar range de escala baseado no tipo
        if (survey.scale_value !== undefined) {
          if (form.question_type === 'scale_0_5' && (survey.scale_value < 0 || survey.scale_value > 5)) {
            throw new BadRequestException('Valor de escala deve estar entre 0 e 5 para este tipo de pergunta');
          }
          if (form.question_type === 'scale_0_10' && (survey.scale_value < 0 || survey.scale_value > 10)) {
            throw new BadRequestException('Valor de escala deve estar entre 0 e 10 para este tipo de pergunta');
          }
        }

        return this.surveyRepository.save({
          form_id: survey.form_id,
          scale_value: survey.scale_value,
          text_response: survey.text_response,
          session_id: sessionId,
        });
      })
    );

    return {
      id: sessionId,
      session_id: sessionId,
      created_at: new Date(),
      surveys,
    };
  }

  async findAllByForm(formId: string): Promise<SatisfactionSurvey[]> {
    return this.surveyRepository.find({
      where: { form_id: formId },
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllByCompany(companyId: string): Promise<SatisfactionSurvey[]> {
    const forms = await this.formRepository.find({
      where: { company_id: companyId },
    });

    const formIds = forms.map((form) => form.id);

    return this.surveyRepository.find({
      where: formIds.map((id) => ({ form_id: id })),
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SatisfactionSurvey> {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['form'],
    });

    if (!survey) {
      throw new NotFoundException('Pesquisa não encontrada');
    }

    return survey;
  }

  async getStatisticsByCompany(companyId: string) {
    const forms = await this.formRepository.find({
      where: { company_id: companyId },
      order: { order: 'ASC' },
    });

    if (forms.length === 0) {
      return {
        totalResponses: 0,
        averageSatisfaction: 0,
        questionStatistics: [],
        responsesByDate: [],
        textResponsesCount: 0,
        scaleResponsesCount: 0,
      };
    }

    const formIds = forms.map((form) => form.id);
    const surveys = await this.surveyRepository.find({
      where: formIds.map((id) => ({ form_id: id })),
      relations: ['form'],
      order: { created_at: 'ASC' },
    });

    // Estatísticas gerais
    const scaleSurveys = surveys.filter((s) => s.scale_value !== null);
    const textSurveys = surveys.filter((s) => s.text_response && s.text_response.trim() !== '');

    const totalResponses = surveys.length;
    const scaleResponsesCount = scaleSurveys.length;
    const textResponsesCount = textSurveys.length;

    // Média geral de satisfação (apenas perguntas de escala)
    const averageSatisfaction =
      scaleSurveys.length > 0
        ? scaleSurveys.reduce((sum, s) => sum + s.scale_value, 0) / scaleSurveys.length
        : 0;

    // Estatísticas por pergunta
    const questionStatistics = forms.map((form) => {
      const questionSurveys = surveys.filter((s) => s.form_id === form.id);
      const questionScaleSurveys = questionSurveys.filter((s) => s.scale_value !== null);

      // Distribuição de notas
      const distribution: { [key: number]: number } = {};
      questionScaleSurveys.forEach((s) => {
        distribution[s.scale_value] = (distribution[s.scale_value] || 0) + 1;
      });

      // Média da pergunta
      const average =
        questionScaleSurveys.length > 0
          ? questionScaleSurveys.reduce((sum, s) => sum + s.scale_value, 0) /
            questionScaleSurveys.length
          : 0;

      // Respostas de texto
      const textResponses = questionSurveys
        .filter((s) => s.text_response && s.text_response.trim() !== '')
        .map((s) => ({
          id: s.id,
          response: s.text_response,
          created_at: s.created_at,
        }));

      return {
        formId: form.id,
        question: form.question,
        questionType: form.question_type,
        totalResponses: questionSurveys.length,
        scaleResponses: questionScaleSurveys.length,
        textResponses: textResponses.length,
        average: Math.round(average * 100) / 100,
        distribution,
        textResponsesList: textResponses,
      };
    });

    // Respostas por data
    const responsesByDateMap: { [key: string]: number } = {};
    surveys.forEach((survey) => {
      const date = new Date(survey.created_at).toISOString().split('T')[0];
      responsesByDateMap[date] = (responsesByDateMap[date] || 0) + 1;
    });

    const responsesByDate = Object.entries(responsesByDateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalResponses,
      averageSatisfaction: Math.round(averageSatisfaction * 100) / 100,
      questionStatistics,
      responsesByDate,
      textResponsesCount,
      scaleResponsesCount,
    };
  }

  async getResponsesBySession(surveyId: string, companyId: string) {
    // Buscar a resposta específica
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['form'],
    });

    if (!survey) {
      throw new NotFoundException('Resposta não encontrada');
    }

    // Verificar se a resposta pertence à empresa
    const form = await this.formRepository.findOne({
      where: { id: survey.form_id },
    });

    if (!form || form.company_id !== companyId) {
      throw new NotFoundException('Resposta não encontrada');
    }

    // Buscar todas as respostas criadas no mesmo segundo (mesma sessão)
    const sessionStart = new Date(survey.created_at);
    sessionStart.setMilliseconds(0);
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setSeconds(sessionEnd.getSeconds() + 1);

    // Buscar todos os formulários da empresa
    const companyForms = await this.formRepository.find({
      where: { company_id: companyId },
    });
    const formIds = companyForms.map((f) => f.id);

    // Buscar todas as respostas da mesma sessão
    const sessionResponses = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.form', 'form')
      .where('survey.form_id IN (:...formIds)', { formIds })
      .andWhere('survey.created_at >= :start', { start: sessionStart })
      .andWhere('survey.created_at < :end', { end: sessionEnd })
      .orderBy('form.order', 'ASC')
      .getMany();

    // Organizar respostas por pergunta
    const responsesByQuestion = sessionResponses.map((response) => ({
      formId: response.form_id,
      question: response.form.question,
      questionType: response.form.question_type,
      scaleValue: response.scale_value,
      textResponse: response.text_response,
      createdAt: response.created_at,
    }));

    return {
      sessionDate: survey.created_at,
      responses: responsesByQuestion,
    };
  }
}

