import { PostRepositoryInterface } from "../types/PostRepositoryInterface";
import { TypeormPostEntity } from "../classes/TypeormPostEntity";
import { TypeormDataSource } from "../typeorm-data-source";
import { Repository } from "typeorm";

export class TypeormPostRepository implements PostRepositoryInterface {
  postRepository: Repository<TypeormPostEntity>

  constructor() {
    this.postRepository = TypeormDataSource.getRepository(TypeormPostEntity)
  }

  async getPosts() {
    const savedPosts = await this.postRepository.find()
    return savedPosts
  }

  async findPost(id: number) {
    const post = await this.postRepository.findOneBy({ id: id })
    return post
  }

  async addPost(newPost: TypeormPostEntity) {
    const savedPost = await this.postRepository.save(newPost)
    return savedPost
  }
}