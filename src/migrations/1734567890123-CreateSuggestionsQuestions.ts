import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSuggestionsQuestions1734567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar a tabela suggestions_questions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS suggestions_questions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        question VARCHAR(500) NOT NULL,
        question_type VARCHAR(50) NOT NULL DEFAULT 'scale_0_10',
        category VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Adicionar trigger para updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_suggestions_questions_updated_at 
      BEFORE UPDATE ON suggestions_questions 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Inserir perguntas de satisfação para consultórios odontológicos
    const questions = [
      // Categoria: Atendimento Geral
      {
        question: 'Como você avalia o atendimento geral da clínica?',
        question_type: 'scale_0_10',
        category: 'Atendimento Geral',
      },
      {
        question: 'Qual sua satisfação geral com o serviço prestado?',
        question_type: 'scale_0_10',
        category: 'Atendimento Geral',
      },
      {
        question: 'Você recomendaria nossa clínica para amigos e familiares?',
        question_type: 'scale_0_10',
        category: 'Atendimento Geral',
      },
      {
        question: 'Como você avalia a experiência geral no consultório?',
        question_type: 'scale_0_10',
        category: 'Atendimento Geral',
      },

      // Categoria: Profissionalismo e Competência
      {
        question: 'Como você avalia o profissionalismo do dentista?',
        question_type: 'scale_0_10',
        category: 'Profissionalismo e Competência',
      },
      {
        question: 'O dentista explicou claramente o procedimento realizado?',
        question_type: 'scale_0_10',
        category: 'Profissionalismo e Competência',
      },
      {
        question: 'Como você avalia a competência técnica do profissional?',
        question_type: 'scale_0_10',
        category: 'Profissionalismo e Competência',
      },
      {
        question: 'O dentista demonstrou conhecimento sobre seu caso?',
        question_type: 'scale_0_10',
        category: 'Profissionalismo e Competência',
      },
      {
        question: 'Como você avalia a atenção e cuidado do dentista?',
        question_type: 'scale_0_10',
        category: 'Profissionalismo e Competência',
      },
      {
        question: 'O profissional respondeu adequadamente suas dúvidas?',
        question_type: 'scale_0_10',
        category: 'Profissionalismo e Competência',
      },

      // Categoria: Atendimento e Recepção
      {
        question: 'Como você avalia o atendimento na recepção?',
        question_type: 'scale_0_10',
        category: 'Atendimento e Recepção',
      },
      {
        question: 'A equipe de recepção foi prestativa e educada?',
        question_type: 'scale_0_10',
        category: 'Atendimento e Recepção',
      },
      {
        question: 'O agendamento foi realizado de forma eficiente?',
        question_type: 'scale_0_10',
        category: 'Atendimento e Recepção',
      },
      {
        question: 'Como você avalia a comunicação da equipe de recepção?',
        question_type: 'scale_0_10',
        category: 'Atendimento e Recepção',
      },
      {
        question: 'Você foi bem recebido ao chegar na clínica?',
        question_type: 'scale_0_10',
        category: 'Atendimento e Recepção',
      },

      // Categoria: Ambiente e Instalações
      {
        question: 'Como você avalia a limpeza e higiene do consultório?',
        question_type: 'scale_0_10',
        category: 'Ambiente e Instalações',
      },
      {
        question: 'O ambiente da clínica é confortável e acolhedor?',
        question_type: 'scale_0_10',
        category: 'Ambiente e Instalações',
      },
      {
        question: 'Como você avalia a organização do consultório?',
        question_type: 'scale_0_10',
        category: 'Ambiente e Instalações',
      },
      {
        question: 'O consultório possui equipamentos modernos?',
        question_type: 'scale_0_10',
        category: 'Ambiente e Instalações',
      },
      {
        question: 'Como você avalia a iluminação e ventilação do ambiente?',
        question_type: 'scale_0_10',
        category: 'Ambiente e Instalações',
      },
      {
        question: 'A sala de espera é confortável?',
        question_type: 'scale_0_10',
        category: 'Ambiente e Instalações',
      },

      // Categoria: Tempo de Espera
      {
        question: 'Como você avalia o tempo de espera para ser atendido?',
        question_type: 'scale_0_10',
        category: 'Tempo de Espera',
      },
      {
        question: 'Você foi atendido no horário agendado?',
        question_type: 'scale_0_10',
        category: 'Tempo de Espera',
      },
      {
        question: 'O tempo de espera foi razoável?',
        question_type: 'scale_0_10',
        category: 'Tempo de Espera',
      },

      // Categoria: Procedimento e Tratamento
      {
        question: 'Como você avalia o procedimento realizado?',
        question_type: 'scale_0_10',
        category: 'Procedimento e Tratamento',
      },
      {
        question: 'O tratamento foi realizado com cuidado e precisão?',
        question_type: 'scale_0_10',
        category: 'Procedimento e Tratamento',
      },
      {
        question: 'Você sentiu dor ou desconforto durante o procedimento?',
        question_type: 'scale_0_10',
        category: 'Procedimento e Tratamento',
      },
      {
        question: 'O dentista foi cuidadoso durante o tratamento?',
        question_type: 'scale_0_10',
        category: 'Procedimento e Tratamento',
      },
      {
        question: 'Como você avalia a eficácia do tratamento realizado?',
        question_type: 'scale_0_10',
        category: 'Procedimento e Tratamento',
      },
      {
        question: 'Você está satisfeito com o resultado do tratamento?',
        question_type: 'scale_0_10',
        category: 'Procedimento e Tratamento',
      },

      // Categoria: Informações e Orientações
      {
        question: 'Você recebeu orientações adequadas sobre cuidados pós-tratamento?',
        question_type: 'scale_0_10',
        category: 'Informações e Orientações',
      },
      {
        question: 'As informações sobre o tratamento foram claras?',
        question_type: 'scale_0_10',
        category: 'Informações e Orientações',
      },
      {
        question: 'Você recebeu explicações sobre os custos do tratamento?',
        question_type: 'scale_0_10',
        category: 'Informações e Orientações',
      },
      {
        question: 'As orientações de higiene bucal foram adequadas?',
        question_type: 'scale_0_10',
        category: 'Informações e Orientações',
      },

      // Categoria: Preço e Valor
      {
        question: 'Como você avalia o custo-benefício do tratamento?',
        question_type: 'scale_0_10',
        category: 'Preço e Valor',
      },
      {
        question: 'Os valores cobrados são justos?',
        question_type: 'scale_0_10',
        category: 'Preço e Valor',
      },
      {
        question: 'Você considera o preço adequado para o serviço prestado?',
        question_type: 'scale_0_10',
        category: 'Preço e Valor',
      },
      {
        question: 'As formas de pagamento são convenientes?',
        question_type: 'scale_0_10',
        category: 'Preço e Valor',
      },

      // Categoria: Localização e Acessibilidade
      {
        question: 'A localização da clínica é conveniente para você?',
        question_type: 'scale_0_10',
        category: 'Localização e Acessibilidade',
      },
      {
        question: 'Como você avalia o acesso e estacionamento?',
        question_type: 'scale_0_10',
        category: 'Localização e Acessibilidade',
      },
      {
        question: 'A clínica é de fácil acesso?',
        question_type: 'scale_0_10',
        category: 'Localização e Acessibilidade',
      },

      // Categoria: Equipe Auxiliar
      {
        question: 'Como você avalia o atendimento da equipe auxiliar?',
        question_type: 'scale_0_10',
        category: 'Equipe Auxiliar',
      },
      {
        question: 'A equipe auxiliar foi prestativa e profissional?',
        question_type: 'scale_0_10',
        category: 'Equipe Auxiliar',
      },
      {
        question: 'A assistente odontológica foi cuidadosa?',
        question_type: 'scale_0_10',
        category: 'Equipe Auxiliar',
      },

      // Categoria: Medo e Ansiedade
      {
        question: 'O ambiente ajudou a reduzir sua ansiedade?',
        question_type: 'scale_0_10',
        category: 'Medo e Ansiedade',
      },
      {
        question: 'O dentista foi sensível às suas preocupações?',
        question_type: 'scale_0_10',
        category: 'Medo e Ansiedade',
      },
      {
        question: 'Você se sentiu confortável durante o atendimento?',
        question_type: 'scale_0_10',
        category: 'Medo e Ansiedade',
      },
      {
        question: 'O profissional explicou os passos do procedimento para reduzir ansiedade?',
        question_type: 'scale_0_10',
        category: 'Medo e Ansiedade',
      },

      // Categoria: Tecnologia e Equipamentos
      {
        question: 'Como você avalia a modernidade dos equipamentos utilizados?',
        question_type: 'scale_0_10',
        category: 'Tecnologia e Equipamentos',
      },
      {
        question: 'Os equipamentos estão em bom estado de conservação?',
        question_type: 'scale_0_10',
        category: 'Tecnologia e Equipamentos',
      },
      {
        question: 'A clínica utiliza tecnologia moderna no tratamento?',
        question_type: 'scale_0_10',
        category: 'Tecnologia e Equipamentos',
      },

      // Categoria: Segurança e Higiene
      {
        question: 'Você se sentiu seguro quanto aos protocolos de higiene?',
        question_type: 'scale_0_10',
        category: 'Segurança e Higiene',
      },
      {
        question: 'Os protocolos de biossegurança foram seguidos?',
        question_type: 'scale_0_10',
        category: 'Segurança e Higiene',
      },
      {
        question: 'Como você avalia a esterilização dos materiais?',
        question_type: 'scale_0_10',
        category: 'Segurança e Higiene',
      },
      {
        question: 'A equipe utilizou equipamentos de proteção adequados?',
        question_type: 'scale_0_10',
        category: 'Segurança e Higiene',
      },

      // Categoria: Comunicação
      {
        question: 'A comunicação com a clínica foi clara e eficiente?',
        question_type: 'scale_0_10',
        category: 'Comunicação',
      },
      {
        question: 'Você foi informado sobre possíveis mudanças no agendamento?',
        question_type: 'scale_0_10',
        category: 'Comunicação',
      },
      {
        question: 'Como você avalia a comunicação pré e pós-consulta?',
        question_type: 'scale_0_10',
        category: 'Comunicação',
      },

      // Categoria: Fidelização
      {
        question: 'Você pretende retornar para novos tratamentos?',
        question_type: 'scale_0_10',
        category: 'Fidelização',
      },
      {
        question: 'Você confiaria na clínica para tratamentos mais complexos?',
        question_type: 'scale_0_10',
        category: 'Fidelização',
      },
      {
        question: 'Você se sente leal à nossa clínica?',
        question_type: 'scale_0_10',
        category: 'Fidelização',
      },

      // Categoria: Opinião Geral (Text)
      {
        question: 'O que mais você gostou no atendimento?',
        question_type: 'text_opinion',
        category: 'Opinião Geral',
      },
      {
        question: 'O que poderia ser melhorado na clínica?',
        question_type: 'text_opinion',
        category: 'Opinião Geral',
      },
      {
        question: 'Tem alguma sugestão para melhorarmos nossos serviços?',
        question_type: 'text_opinion',
        category: 'Opinião Geral',
      },
      {
        question: 'Comentários adicionais sobre sua experiência:',
        question_type: 'text_opinion',
        category: 'Opinião Geral',
      },

      // Categoria: Saúde Bucal
      {
        question: 'Como você avalia sua saúde bucal atual?',
        question_type: 'scale_0_10',
        category: 'Saúde Bucal',
      },
      {
        question: 'Você realiza consultas preventivas regularmente?',
        question_type: 'scale_0_5',
        category: 'Saúde Bucal',
      },
      {
        question: 'Como você avalia a importância da saúde bucal?',
        question_type: 'scale_0_10',
        category: 'Saúde Bucal',
      },
      {
        question: 'Você segue as orientações de higiene bucal recomendadas?',
        question_type: 'scale_0_10',
        category: 'Saúde Bucal',
      },

      // Categoria: Estética
      {
        question: 'Como você avalia a atenção à estética do seu sorriso?',
        question_type: 'scale_0_10',
        category: 'Estética',
      },
      {
        question: 'Você está satisfeito com a aparência do seu sorriso?',
        question_type: 'scale_0_10',
        category: 'Estética',
      },
      {
        question: 'O dentista considerou aspectos estéticos no tratamento?',
        question_type: 'scale_0_10',
        category: 'Estética',
      },

      // Categoria: Urgência e Emergência
      {
        question: 'Em caso de emergência, você confiaria na clínica?',
        question_type: 'scale_0_10',
        category: 'Urgência e Emergência',
      },
      {
        question: 'A clínica oferece atendimento de urgência?',
        question_type: 'scale_0_5',
        category: 'Urgência e Emergência',
      },
    ];

    // Inserir todas as perguntas
    for (const q of questions) {
      const escapedQuestion = q.question.replace(/'/g, "''");
      const categoryValue = q.category ? `'${q.category.replace(/'/g, "''")}'` : 'NULL';
      await queryRunner.query(
        `INSERT INTO suggestions_questions (question, question_type, category, created_at, updated_at) 
         VALUES ('${escapedQuestion}', '${q.question_type}', ${categoryValue}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('suggestions_questions');
  }
}

