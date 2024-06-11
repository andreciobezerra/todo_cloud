import { Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: configService.get("JWT_SECRET"),
      ignoreExpiration: process.env.NODE_ENV == "developmen",
    });
  }

  async validate(payload: any) {
    return payload;
  }

  private static extractJWT(@Req() req: any) {
    return req.cookies["auth-cookie"];
  }
}
