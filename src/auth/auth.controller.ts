import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Post('admin/create-company')
  async createCompany(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
    return this.authService.createCompany(createCompanyDto, req.user.user_type);
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Post('admin/create-user')
  async createUser(@Request() req, @Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto, req.user.user_type);
  }
}

