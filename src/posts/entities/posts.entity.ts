import { BaseEntity } from "src/common/entity/base.entity";
import { Users } from "src/users/entities/users.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity()
export class Posts extends BaseEntity{
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @ManyToOne(() => Users, (user) => user.posts, { nullable: false })
  @JoinColumn()
  user: Users;
}
