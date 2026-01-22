import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'pesquisa_db',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/**/*{.ts,.js}')],
  synchronize: false,
  logging: false,
});

export default dataSource;

