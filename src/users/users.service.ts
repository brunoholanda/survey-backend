import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async findAll() {
    return this.authRepository.find({
      relations: ['company'],
      order: { created_at: 'DESC' },
      select: {
        id: true,
        login: true,
        user_type: true,
        company_id: true,
        created_at: true,
        updated_at: true,
        company: {
          id: true,
          name: true,
          cnpj: true,
          description: true,
          address: true,
          logo_path: true,
        },
      },
    });
  }
}



