import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth } from '../entities/auth.entity';
import { Company } from '../entities/company.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { login, password, name, description, cnpj, address, logo_path } = registerDto;

    // Verificar se o login já existe
    const existingAuth = await this.authRepository.findOne({
      where: { login },
    });

    if (existingAuth) {
      throw new ConflictException('Login já está em uso');
    }

    // Verificar se o CNPJ já existe
    const existingCompany = await this.companyRepository.findOne({
      where: { cnpj },
    });

    if (existingCompany) {
      throw new ConflictException('CNPJ já está cadastrado');
    }

    // Criar empresa
    const company = this.companyRepository.create({
      name,
      description,
      cnpj,
      address,
      logo_path,
    });

    const savedCompany = await this.companyRepository.save(company);

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar autenticação
    const auth = this.authRepository.create({
      login,
      password: hashedPassword,
      company_id: savedCompany.id,
    });

    await this.authRepository.save(auth);

    return {
      message: 'Empresa cadastrada com sucesso',
      company: {
        id: savedCompany.id,
        name: savedCompany.name,
        cnpj: savedCompany.cnpj,
      },
    };
  }

  async validateUser(login: string, password: string): Promise<any> {
    const auth = await this.authRepository.findOne({
      where: { login },
      relations: ['company'],
    });

    if (!auth) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, auth.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      id: auth.company.id,
      company_id: auth.company_id,
      login: auth.login,
      company: auth.company,
    };
  }

  async login(user: any) {
    const payload = {
      sub: user.company_id,
      login: user.login,
      company_id: user.company_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        company_id: user.company_id,
        login: user.login,
        company: {
          id: user.company.id,
          name: user.company.name,
          cnpj: user.company.cnpj,
          description: user.company.description,
          address: user.company.address,
          logo_path: user.company.logo_path,
        },
      },
    };
  }
}

