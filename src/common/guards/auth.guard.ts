import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request | undefined>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload: unknown = this.jwtService.verify(token);
      if (request) {
        (request as Request & { user?: unknown }).user = payload;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request | undefined): string | undefined {
    const authHeader = request?.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return undefined;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return undefined;
    }

    const [type, token] = parts;
    return type === 'Bearer' ? token : undefined;
  }
}
