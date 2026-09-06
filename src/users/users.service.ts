import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  /**
   * nickname, email, password 를 입력받아 사용자 정보를 저장하는 함수이다.
   * @param user nickname, email, password
   * @returns userObject
   * @throws BadRequestException 닉네임 중복 시
   * @throws BadRequestException 중복 이메일 시
   * @throws Error 사용자 정보 저장 실패 시
   */
  async createUser(user: Pick<Users, "nickname" | "email" | "password">) {
    const nicknameExists = await this.userRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException("닉네임 중복!");
    }

    const emailExist = await this.userRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExist) {
      throw new BadRequestException("중복 이메일!");
    }

    const userObject = await this.userRepository.save({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    return userObject;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
