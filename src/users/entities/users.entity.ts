import { Posts } from "src/posts/entities/posts.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../const/users.role";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true, // 유니크 할 것
    length: 20, // 길이 20 넘지 않을 것
  })
  nickname: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(Roles),
    default: Roles.USER,
  })
  role: Roles;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
