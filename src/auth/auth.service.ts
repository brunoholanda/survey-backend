import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth } from '../entities/auth.entity';
import { Company } from '../entities/company.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

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

    // Criar autenticação (tipo 2 por padrão)
    const auth = this.authRepository.create({
      login,
      password: hashedPassword,
      company_id: savedCompany.id,
      user_type: 2,
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
      id: auth.id,
      company_id: auth.company_id,
      login: auth.login,
      user_type: auth.user_type,
      company: auth.company,
    };
  }

  async createUser(createUserDto: CreateUserDto, adminUserType: number) {
    if (adminUserType !== 1) {
      throw new UnauthorizedException('Apenas administradores podem criar usuários');
    }

    const { login, password, user_type, company_id } = createUserDto;

    // Verificar se o login já existe
    const existingAuth = await this.authRepository.findOne({
      where: { login },
    });

    if (existingAuth) {
      throw new ConflictException('Login já está em uso');
    }

    // Se for tipo 2, verificar se company_id foi fornecido
    if (user_type === 2 && !company_id) {
      throw new BadRequestException('company_id é obrigatório para usuários tipo 2');
    }

    // Se for tipo 2, verificar se a company existe
    if (user_type === 2) {
      const company = await this.companyRepository.findOne({
        where: { id: company_id },
      });

      if (!company) {
        throw new NotFoundException('Empresa não encontrada');
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar autenticação
    const auth = this.authRepository.create({
      login,
      password: hashedPassword,
      user_type,
      company_id: user_type === 2 ? company_id : null,
    });

    await this.authRepository.save(auth);

    return {
      message: 'Usuário criado com sucesso',
      user: {
        id: auth.id,
        login: auth.login,
        user_type: auth.user_type,
        company_id: auth.company_id,
      },
    };
  }

  async createCompany(createCompanyDto: CreateCompanyDto, adminUserType: number) {
    if (adminUserType !== 1) {
      throw new UnauthorizedException('Apenas administradores podem criar empresas');
    }

    const { name, description, cnpj, address, logo_path } = createCompanyDto;

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

    return {
      message: 'Empresa criada com sucesso',
      company: {
        id: savedCompany.id,
        name: savedCompany.name,
        cnpj: savedCompany.cnpj,
        description: savedCompany.description,
        address: savedCompany.address,
        logo_path: savedCompany.logo_path,
      },
    };
  }

  async login(user: any) {
    const payload = {
      sub: user.company_id || user.id,
      login: user.login,
      company_id: user.company_id,
      user_type: user.user_type,
    };

    const response: any = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        company_id: user.company_id,
        login: user.login,
        user_type: user.user_type,
      },
    };

    if (user.company) {
      response.user.company = {
        id: user.company.id,
        name: user.company.name,
        cnpj: user.company.cnpj,
        description: user.company.description,
        address: user.company.address,
        logo_path: user.company.logo_path,
      };
    }

    return response;
  }
}

