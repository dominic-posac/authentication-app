import { PostEntity } from "../classes/PostEntity";

export interface GetPostsInterface {
  getPosts(): Promise<PostEntity[]>;
}

export interface FindPostInterface {
  findPost(id: number): Promise<PostEntity>;
}

export interface AddPostInterface extends FindPostInterface {
  addPost(newPost: PostEntity): Promise<PostEntity>;
}

export interface PostRepositoryInterface extends GetPostsInterface, AddPostInterface {}