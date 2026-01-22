import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserTypeToAuth1734567890124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna user_type
    await queryRunner.addColumn(
      'auth',
      new TableColumn({
        name: 'user_type',
        type: 'int',
        default: 2,
        isNullable: false,
      }),
    );

    // Tornar company_id nullable (usuários tipo 1 não têm company_id)
    await queryRunner.query(`
      ALTER TABLE auth 
      ALTER COLUMN company_id DROP NOT NULL;
    `);

    // Atualizar todos os registros existentes para tipo 2
    await queryRunner.query(`
      UPDATE auth 
      SET user_type = 2 
      WHERE user_type IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover coluna user_type
    await queryRunner.dropColumn('auth', 'user_type');

    // Tornar company_id NOT NULL novamente
    await queryRunner.query(`
      ALTER TABLE auth 
      ALTER COLUMN company_id SET NOT NULL;
    `);
  }
}


