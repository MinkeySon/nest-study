import { Body, Controller, Post, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MinLengthPipe, PasswordPipe } from "./pipe/password.pipe";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login/email")
  @ApiOperation({ summary: "이메일 로그인" })
  loginEmail(@Body("email") email: string, @Body("password") password: string) {
    return this.authService.loginWithEmail({ email, password });
  }

  @Post("register/email")
  @ApiOperation({ summary: "이메일 회원가입" })
  @ApiBody({ schema: { type: "object", properties: { nickname: { type: "string" }, email: { type: "string" }, password: { type: "string" } } } })
  registerEmail(
    @Body("nickname") nickname: string,
    @Body("email") email: string,
    @Body("password", new MinLengthPipe(8), new MinLengthPipe(3)) password: string,
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
