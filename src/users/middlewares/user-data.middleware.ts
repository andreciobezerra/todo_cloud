import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserDataMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, _res: any, next: () => void) {
    const token = req.cookies?.authCookie;

    if (!token) {
      throw new UnauthorizedException();
    }

    const { userId } = this.jwtService.decode(token) as Record<string, any>;

    req.userId = userId;
    next();
  }
}
