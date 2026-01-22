import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.user_type !== 1) {
      throw new ForbiddenException('Acesso negado. Apenas administradores podem realizar esta ação.');
    }

    return true;
  }
}



