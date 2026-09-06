import { Body, Controller, Post, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login/email")
  loginEmail(@Body("email") email: string, @Body("password") password: string) {
    return this.authService.loginWithEmail({ email, password });
  }

  @Post("register/email")
  registerEmail(
    @Body("nickname") nickname: string,
    @Body("email") email: string,
    @Body("password") password: string,
  ) {
    return this.authService.registerWithEmail({ nickname, email, password });
  }

  @Post("token/access")
  createTokenAccess(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post("token/refresh")
  createTokenRefresh(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }
}
