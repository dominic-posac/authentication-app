import { TypeormUserEntity } from "../classes/TypeormUserEntity";
import { TypeormDataSource } from "../typeorm-data-source";
import { Repository } from "typeorm";
import { UserRepositoryInterface } from "../types/UserRepositoryInterface";

export class TypeormUserRepository implements UserRepositoryInterface {
  userRepository: Repository<TypeormUserEntity>

  constructor() {
    this.userRepository = TypeormDataSource.getRepository(TypeormUserEntity)
  }

  async getUsers() {
    const savedUser = await this.userRepository.find()
    return savedUser
  }

  async findUser(email: string) {
    const user = await this.userRepository.findOneBy({ email: email})
    return user
  }

  async addUser(newUser: TypeormUserEntity) {
    const savedUser = await this.userRepository.save(newUser)
    return 
  }
}