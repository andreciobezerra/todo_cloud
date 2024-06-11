import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const [user] = await this.userService.find({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException("Login data is incorrect");
    }

    const passwordIsValid = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException("Login data is incorrect");
    }

    delete user.password;

    return this.signToken(user);
  }

  private async signToken(user: Omit<User, "password">) {
    const payload = { userId: user.id };
    const tokenConfig = { secret: this.configService.get("JWT_SECRET") };
    const token = await this.jwtService.signAsync(payload, tokenConfig);

    return token;
  }
}
