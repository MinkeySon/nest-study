import { Injectable, NotFoundException } from "@nestjs/common";

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

  /**
   * @abstract 모든 posts를 가져오는 함수
   * @returns 모든 posts
   */  
  getAllPosts() {
    return posts;
  }

  /**
   * id를 기반으로 특정 post를 가져오는 함수
   * @param id 고유 id
   * @returns 특정 post
   */
  getPostsById(id: number) {
    // find 메서드는 배열에서 특정 조건을 만족하는 요소를 반환, 만약 조건을 만족하는 요소가 없다면 undefined를 반환
    // undefined 는 boolean false 로 평가됨
    const foundedPost = posts.find((post) => post.id === id);

    // 만약 post가 존재하지 않는다면 NotFoundException을 발생
    if (!foundedPost) {
      throw new NotFoundException();
    }

    return foundedPost;
  }

  /**
   * @abstract 새로운 post를 생성하는 함수
   * @param author 작성자
   * @param title 제목
   * @param content 내용
   * @returns 새로 생성된 post
   */
  postPosts(author: string, title: string, content: string) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts.push(post);

    return post;
  }

  /**
   * @discription 특정 post를 수정 함수
   * @param id 고유 id
   * @param author 작성자
   * @param title 제목
   * @param content 내용
   * @returns 수정된 post
   */
  putPostById(id: number, author?: string, title?: string, content?: string) {
    const foundedPost = posts.find((post) => post.id === id);

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

    // map 순회 하면서 id 가 일치하는 post 만 업데이트
    posts = posts.map((prevPost) =>
      prevPost.id === id ? foundedPost : prevPost,
    );

    return foundedPost;
  }

  /**
   * @discription 특정 post를 삭제하는 함수
   * @param id 고유 id
   * @returns 삭제된 post
   */
  deletePostById(id: number) {
    const foundedPost = posts.find((post) => post.id === id);

    if (!foundedPost) {
      throw new NotFoundException();
    }

    // filter 순회 하면서 id 가 일치하지 않는 post 만 남김
    posts = posts.filter((post) => post.id !== id);

    return foundedPost;
  }
}
