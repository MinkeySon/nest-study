import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel{
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts : PostModel[] = [
  {
    id: 1,
    author: 'son',
    title: 'test post',
    content: 'this is a test post',
    likeCount: 99999,
    commentCount: 99999
  },
  {
    id: 2,
    author: 'son',
    title: 'test post 2',
    content: 'this is second test post',
    likeCount: 88888,
    commentCount: 88888
  },
  {
    id: 3,
    author: 'son',
    title: 'test post 3',
    content: 'this is a third test post',
    likeCount: 77777,
    commentCount: 77777
  }
]

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts
   * @description 모든 posts를 가져오는 API
   * @returns 모든 posts
   */
  @Get()
  getPosts(){
    return posts;
  }

  /**
   * GET /posts/:id
   * @description 특정 post를 가져오는 API
   * @returns 특정 post
   */
  @Get(':id')
  getPost(@Param('id') id: string){

    // find 메서드는 배열에서 특정 조건을 만족하는 요소를 반환, 만약 조건을 만족하는 요소가 없다면 undefined를 반환
    // undefined 는 boolean false 로 평가됨
    const foundedPost = posts.find((post) => post.id === parseInt(id));

    // 만약 post가 존재하지 않는다면 NotFoundException을 발생
    if(!foundedPost){
      throw new NotFoundException();
  }

  return foundedPost;
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
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ){

    const post = { 
      id: posts[posts.length - 1].id + 1,  
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0
    }

    posts.push(post);

    return post;
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
  @Put(':id')
  putPost(
    @Param('id') id: string,

    // ? 붙이면 null 허용
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string
  ){
    const foundedPost = posts.find((post) => post.id === parseInt(id));

    if(!foundedPost){
      throw new NotFoundException();
    }

    if (author){
      foundedPost.author = author;
    }

    if (title){
      foundedPost.title = title;
    }

    if (content){
      foundedPost.content = content;
    }

    // map 순회 하면서 id 가 일치하는 post 만 업데이트
    posts = posts.map((prevPost) => prevPost.id === parseInt(id) ? foundedPost : prevPost);

    return foundedPost;
  }

  /**
   * DELETE /posts/:id
   * @description 특정 post를 삭제하는 API
   * @param id id
   * @returns 삭제된 post
   */
  @Delete(':id')
  deletePost(
    @Param('id') id: string,
  ){
    const foundedPost = posts.find((post) => post.id === parseInt(id));

    if(!foundedPost){
      throw new NotFoundException();
    }

    // filter 순회 하면서 id 가 일치하지 않는 post 만 남김
    posts = posts.filter((post) => post.id !== parseInt(id));
    
    return foundedPost;
  }

}
