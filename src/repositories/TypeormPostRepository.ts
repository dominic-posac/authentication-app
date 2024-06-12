import { PostRepositoryInterface } from "../types/PostRepositoryInterface";
import { PostEntity } from "../classes/PostEntity";
import { TypeormDataSource } from "../typeorm-data-source";
import { Repository } from "typeorm";

export class TypeormPostRepository implements PostRepositoryInterface {
  postRepository: Repository<PostEntity>

  constructor() {
    this.postRepository = TypeormDataSource.getRepository(PostEntity)
  }

  async getPosts() {
    const savedPosts = await this.postRepository.find()
    return savedPosts
  }

  async findPost(id: number) {
    const post = await this.postRepository.findOneBy({ id: id })
    return post
  }

  async addPost(newPost: PostEntity) {
    const savedPost = await this.postRepository.save(newPost)
    return savedPost
  }
}