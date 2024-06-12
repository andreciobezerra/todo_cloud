import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { FastifyReply } from "fastify";
import { IsPublic } from "./is-public.decorator";

const ONE_DAY_MILISECONDS = 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(204)
  @IsPublic()
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
    const token = await this.authService.login(loginDto);

    res.setCookie("authCookie", token, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + ONE_DAY_MILISECONDS),
    });
  }

  @Post("logout")
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie("authCookie");
  }
}
