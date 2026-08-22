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

  async createUser(nickname: string, email: string, password: string) {
    const dupUser = await this.userRepository.findOne({
      where: {
        nickname,
        email,
      },
    });

    if (dupUser) {
      throw new BadRequestException();
    }

    const newUser = await this.userRepository.save({
      nickname,
      email,
      password,
    });

    return newUser;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
}
