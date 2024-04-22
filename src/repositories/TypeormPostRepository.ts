import { PostRepositoryInterface } from "./PostRepositoryInterface";
import { PostEntity } from "../classes/PostEntity";
import { TypeormDataSource } from "../typeorm-data-source";

export class TypeormPostRepository implements PostRepositoryInterface {
  constructor() {
    this.initialize();
  }

  initialize() {
    TypeormDataSource.initialize()
  }

  async getPosts() {
    const postRepository = TypeormDataSource.getRepository(PostEntity)
    const savedPosts = await postRepository.find()
    return savedPosts
  }

  async findPost(id: number) {
    const postRepository = TypeormDataSource.getRepository(PostEntity)
    const post = await postRepository.findOneBy({ id: id })
    return post
  }

  async addPost(newPost: PostEntity) {
    const postRepository = TypeormDataSource.getRepository(PostEntity)
    const savedPost = await postRepository.save(newPost)
    return savedPost
  }
}