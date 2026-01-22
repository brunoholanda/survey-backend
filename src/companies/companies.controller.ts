import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Interface para o arquivo do multer
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Get()
  async findAll() {
    return this.companiesService.findAll();
  }

  // Endpoint público para buscar dados da empresa
  @Get('public/:id')
  async getPublicCompany(@Param('id') id: string) {
    return this.companiesService.findPublicById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyCompany(@Request() req) {
    return this.companiesService.findOne(req.user.company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyCompany(@Request() req, @Body() updateData: UpdateCompanyDto) {
    return this.companiesService.update(req.user.company_id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/upload-logo')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: multer.diskStorage({
        destination: (req: any, file, cb) => {
          const companyId = req.user?.company_id;
          if (!companyId) {
            return cb(new BadRequestException('Company ID não encontrado'), null as any);
          }
          const uploadPath = path.join('uploads', companyId);
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `logo-${uniqueSuffix}.webp`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.'), false);
        }
      },
    }),
  )
  async uploadLogo(@Request() req, @UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const companyId = req.user.company_id;
    const logoPath = `/uploads/${companyId}/${file.filename}`;

    // Atualizar logo_path da empresa
    await this.companiesService.update(companyId, { logo_path: logoPath });

    return {
      message: 'Logo enviado com sucesso',
      logo_path: logoPath,
    };
  }
}

