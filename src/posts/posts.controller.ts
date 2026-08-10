import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts
   * @description 모든 posts를 가져오는 API
   * @returns 모든 posts
   */
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  /**
   * GET /posts/:id
   * @description 특정 post를 가져오는 API
   * @returns 특정 post
   */
  @Get(":id")
  getPost(@Param("id") id: string) {
    return this.postsService.getPostsById(parseInt(id));
  }

  /**
   * POST /posts
   * @description 새로운 post를 생성하는 API
   * @param author 작성자
   * @param title 제목
   * @param content 내용
   * @returns 새로 생성된 post
   */
  @Post()
  postPosts(
    @Body("author") author: string,
    @Body("title") title: string,
    @Body("content") content: string,
  ) {
    return this.postsService.postPosts(author, title, content);
  }

  /**
   * PUT /posts/:id
   * @description 특정 post를 수정하는 API
   * @param id id
   * @param author 작성자
   * @param title 제목
   * @param content 내용
   * @returns 수정된 post
   */
  @Put(":id")
  putPost(
    @Param("id") id: string,

    // ? 붙이면 null 허용
    @Body("author") author?: string,
    @Body("title") title?: string,
    @Body("content") content?: string,
  ) {
    return this.postsService.putPostById(parseInt(id), author, title, content);
  }

  /**
   * DELETE /posts/:id
   * @description 특정 post를 삭제하는 API
   * @param id id
   * @returns 삭제된 post
   */
  @Delete(":id")
  deletePost(@Param("id") id: string) {
    return this.postsService.deletePostById(parseInt(id));
  }
}
