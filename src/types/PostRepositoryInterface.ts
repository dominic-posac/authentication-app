import { TypeormPostEntity } from "../classes/TypeormPostEntity";

export interface GetPostsInterface {
  getPosts(): Promise<TypeormPostEntity[]>;
}

export interface FindPostInterface {
  findPost(id: number): Promise<TypeormPostEntity>;
}

export interface AddPostInterface extends FindPostInterface {
  addPost(newPost: TypeormPostEntity): Promise<TypeormPostEntity>;
}

export interface PostRepositoryInterface extends GetPostsInterface, AddPostInterface {}