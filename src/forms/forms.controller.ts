import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { CreateMultipleFormsDto } from './dto/create-multiple-forms.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // Endpoint público para buscar formulários por company_id
  @Get('public/company/:companyId')
  async findPublicByCompany(@Param('companyId') companyId: string) {
    return this.formsService.findPublicByCompanyId(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(req.user.company_id, createFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('multiple')
  createMultiple(@Request() req, @Body() createMultipleFormsDto: CreateMultipleFormsDto) {
    return this.formsService.createMultiple(req.user.company_id, createMultipleFormsDto.forms);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.formsService.findAllByCompany(req.user.company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/exists')
  async checkFormExists(@Request() req) {
    const exists = await this.formsService.hasForm(req.user.company_id);
    return { exists };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.formsService.findOne(id, req.user.company_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formsService.update(id, req.user.company_id, updateFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.formsService.remove(id, req.user.company_id);
  }
}

