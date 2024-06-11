import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

const ONE_DAY_MILISECONDS = 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(204)
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const token = await this.authService.login(loginDto);

    res.cookie("authCookie", token, { httpOnly: true, expires: ONE_DAY_MILISECONDS });
  }

  @Post("logout")
  @HttpCode(200)
  logout(@Res() res: any) {
    res.cookie("authCookie", null);
  }
}
