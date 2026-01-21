# Backend - Sistema de Pesquisas de Satisfação

Backend desenvolvido em NestJS com PostgreSQL para gerenciamento de pesquisas de satisfação.

## Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- bcrypt

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente:
   - `DB_HOST`: Host do PostgreSQL
   - `DB_PORT`: Porta do PostgreSQL (padrão: 5432)
   - `DB_USERNAME`: Usuário do banco
   - `DB_PASSWORD`: Senha do banco
   - `DB_DATABASE`: Nome do banco de dados
   - `JWT_SECRET`: Chave secreta para JWT
   - `JWT_EXPIRES_IN`: Tempo de expiração do token (padrão: 24h)
   - `PORT`: Porta da aplicação (padrão: 3000)

## Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Estrutura do Banco de Dados

### Tabela `companies`
- `id` (UUID)
- `name` (VARCHAR)
- `description` (TEXT)
- `cnpj` (VARCHAR, único)
- `address` (TEXT)
- `logo_path` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela `auth`
- `id` (UUID)
- `login` (VARCHAR, único)
- `password` (VARCHAR - hash bcrypt)
- `company_id` (UUID, FK para companies)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela `forms`
- `id` (UUID)
- `company_id` (UUID, FK para companies)
- `question` (VARCHAR)
- `question_type` (ENUM: scale_0_5, scale_0_10, text_opinion)
- `order` (INT)
- `is_optional` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela `satisfaction_surveys`
- `id` (UUID)
- `form_id` (UUID, FK para forms)
- `scale_value` (INT, 0-10)
- `text_response` (TEXT)
- `created_at` (TIMESTAMP)

## Endpoints

### Autenticação
- `POST /auth/register` - Registrar nova empresa
- `POST /auth/login` - Login

### Empresas
- `GET /companies/me` - Obter dados da empresa logada (requer autenticação)
- `PUT /companies/me` - Atualizar dados da empresa (requer autenticação)

### Formulários
- `POST /forms` - Criar formulário (requer autenticação)
- `POST /forms/multiple` - Criar múltiplos formulários (requer autenticação)
- `GET /forms` - Listar formulários da empresa (requer autenticação)
- `GET /forms/:id` - Obter formulário específico (requer autenticação)
- `PATCH /forms/:id` - Atualizar formulário (requer autenticação)
- `DELETE /forms/:id` - Deletar formulário (requer autenticação)

### Pesquisas de Satisfação
- `POST /satisfaction-surveys` - Criar resposta de pesquisa
- `POST /satisfaction-surveys/multiple` - Criar múltiplas respostas
- `GET /satisfaction-surveys/form/:formId` - Listar respostas de um formulário
- `GET /satisfaction-surveys/company` - Listar todas as respostas da empresa (requer autenticação)
- `GET /satisfaction-surveys/:id` - Obter resposta específica

