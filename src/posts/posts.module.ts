import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./entities/posts.entity";

@Module({
  imports: [
    // repository 설정
    TypeOrmModule.forFeature([Posts]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
