import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSessionIdToSatisfactionSurveys1769105165899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna session_id
    await queryRunner.addColumn(
      'satisfaction_surveys',
      new TableColumn({
        name: 'session_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover coluna session_id
    await queryRunner.dropColumn('satisfaction_surveys', 'session_id');
  }
}

