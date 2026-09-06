/**
 * 구현할 기능
 * 
 * 1) 요청객체 불러오고 authorization 헤더에서 토큰 추출
 * 2) authService.extractTokenFromHeader를 이용해서 사용할 수 있는 형태의 토큰을 추출한다.
 * 3) authService.decodeBasicToken 을 실행해서 email 과 password 를 추출한다.
 * 4) email 과 password 를 이용해서 사용자를 가져온다.
 * 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly userService: UsersService) { }

    // boolean: false 일 경우 gaurd 통과 x
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // token 추출
        const rawToken = request.headers['authorization'];

        if (!rawToken) {
            throw new UnauthorizedException('Authorization 헤더가 없습니다!');
        }

        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const result = this.authService.verifyToken(token);

        const user = await this.userService.getUserByEmail(result.email);

        request.user = user;
        request.token = token;
        request.tokenType = result.type;

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends JwtTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const request = context.switchToHttp().getRequest();
        if(request.tokenType !== 'access') {
            throw new UnauthorizedException('Access Token 이 아닙니다!');
        }

        return true;
    }
}