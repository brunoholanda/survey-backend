import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { FormsModule } from './forms/forms.module';
import { SatisfactionSurveysModule } from './satisfaction-surveys/satisfaction-surveys.module';
import { SuggestionsQuestionsModule } from './suggestions-questions/suggestions-questions.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    CompaniesModule,
    FormsModule,
    SatisfactionSurveysModule,
    SuggestionsQuestionsModule,
  ],
})
export class AppModule {}

