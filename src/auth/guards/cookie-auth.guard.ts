import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../is-public.decorator";

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    const token = request.cookies?.authCookie;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_SECRET"),
      });

      request.userId = userId;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
