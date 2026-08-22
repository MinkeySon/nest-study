import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostsModule } from "./posts/posts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./posts/entities/posts.entity";
import { UsersModule } from "./users/users.module";
import { Users } from "./users/entities/users.entity";

@Module({
  imports: [
    PostsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres", // 데이터베이스 타입
      host: "127.0.0.1",
      port: 5434,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      entities: [Posts, Users],
      synchronize: true, // 실제 데이터베이스와 싱크를 맞출꺼냐
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
