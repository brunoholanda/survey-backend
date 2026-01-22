import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSessionIdToSatisfactionSurveys1769105165899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a coluna session_id já existe
    const table = await queryRunner.getTable('satisfaction_surveys');
    const columnExists = table?.findColumnByName('session_id');

    if (!columnExists) {
      // Adicionar coluna session_id apenas se não existir
      await queryRunner.addColumn(
        'satisfaction_surveys',
        new TableColumn({
          name: 'session_id',
          type: 'uuid',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a coluna session_id existe antes de remover
    const table = await queryRunner.getTable('satisfaction_surveys');
    const columnExists = table?.findColumnByName('session_id');

    if (columnExists) {
      // Remover coluna session_id apenas se existir
      await queryRunner.dropColumn('satisfaction_surveys', 'session_id');
    }
  }
}

