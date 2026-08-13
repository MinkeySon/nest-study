import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Posts } from "./entities/posts.entity";
import { InjectRepository } from "@nestjs/typeorm";

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: "son",
    title: "test post",
    content: "this is a test post",
    likeCount: 99999,
    commentCount: 99999,
  },
  {
    id: 2,
    author: "son",
    title: "test post 2",
    content: "this is second test post",
    likeCount: 88888,
    commentCount: 88888,
  },
  {
    id: 3,
    author: "son",
    title: "test post 3",
    content: "this is a third test post",
    likeCount: 77777,
    commentCount: 77777,
  },
];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) // DI
    private readonly postRepository: Repository<Posts>, // Posts Entity 를 다루는 레포지토리 선언
  ) {}

  /**
   * @abstract 모든 posts를 가져오는 함수
   * @returns 모든 posts
   */
  async getAllPosts() {
    return this.postRepository.find(); // 모든 TypeORM 메서드는 async
  }

  /**
   * id를 기반으로 특정 post를 가져오는 함수
   * @param id 고유 id
   * @returns 특정 post
   */
  async getPostsById(id: number) {
    // 1. findOne() -> DB 소켓에 쿼리 날리고 아직 값이 없는 Promise<Posts> 를 즉시 반환
    // 2. await 가 Promise 에 완료되면 깨워달라고 등록하고 함수 중단
    // 3. 이때 스레드는 다른 요청 처리하러 감.
    // 4. DB 응답 도착
    // 5. 이벤트 큐에서 2번 작업 꺼냄
    // 6. 함수 재개
    const post = await this.postRepository.findOne({
      // id 값이 일치하는 row 필터
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  /**
   * @abstract 새로운 post를 생성하는 함수
   * @param author 작성자
   * @param title 제목
   * @param content 내용
   * @returns 새로 생성된 post
   */
  async postPosts(author: string, title: string, content: string) {
    // 1) create -> 저장할 객체 생성
    // 2) save -> 객체 저장

    const post = this.postRepository.create({
      // key == value 변수 명이 같으면 하나만 써도 됨.
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  /**
   * @discription 특정 post를 수정 함수
   * @param id 고유 id
   * @param author 작성자
   * @param title 제목
   * @param content 내용
   * @returns 수정된 post
   */
  async putPostById(
    id: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    // 만약에 데이터가 존재한다면 (같은 id 값이 있다면) 그냥 save 해도 업데이트

    const foundedPost = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundedPost) {
      throw new NotFoundException();
    }

    if (author) {
      foundedPost.author = author;
    }

    if (title) {
      foundedPost.title = title;
    }

    if (content) {
      foundedPost.content = content;
    }

    const updatedPost = await this.postRepository.save(foundedPost);

    return updatedPost;
  }

  /**
   * @discription 특정 post를 삭제하는 함수
   * @param id 고유 id
   * @returns 삭제된 post
   */
  async deletePostById(id: number) {
    const foundedPost = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundedPost) {
      throw new NotFoundException();
    }

    // filter 순회 하면서 id 가 일치하지 않는 post 만 남김
    await this.postRepository.delete(id);

    return id;
  }
}
