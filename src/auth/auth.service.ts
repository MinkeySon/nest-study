import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Users } from "src/users/entities/users.entity";
import { HASH_ROUND, JWT_SECRET } from "./const/auth.const";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(" ");
    const prefix = isBearer ? "Bearer" : "Basic";

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException("잘못된 토근 입니다!");
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(token: string) {
    const [email, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');

    return { email, password };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });

    if (decoded.type !== "refresh") {
      throw new UnauthorizedException("refresh 가 아닙니다!");
    }

    return this.signToken({
        ...decoded,
    }, isRefreshToken,);
  }

  async loginWithEmail(user: Pick<Users, "email" | "password">) {
    const existingUser = await this.authenticationWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  /**
   * 
   * @param user nickname, email, password
   */
  async registerWithEmail(
    user: Pick<Users, "nickname" | "email" | "password">,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUND);

    const newUser = await this.userService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }

  /**
   * Payload 들어갈 정보
   * (1) email
   * (2) sub -> id
   * (3) type: 'access' | 'refresh'
   */
  signToken(user: Pick<Users, "email" | "id">, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? "refresh" : "access",
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300, // sec
    });
  }

  loginUser(user: Pick<Users, "email" | "id">) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticationWithEmailAndPassword(
    user: Pick<Users, "email" | "password">,
  ) {
    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException("존재하지 않는 사용자입니다.");
    }

    /**
     * 1) 입력된 비밀번호
     * 2) 기존 해시 -> 사용자 정보에 저장돼있는 hash
     */
    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    return existingUser;
  }
}
