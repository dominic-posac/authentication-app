import { UserEntity } from "../classes/UserEntity";
import { TypeormDataSource } from "../typeorm-data-source";
import { Repository } from "typeorm";
import { UserRepositoryInterface } from "../types/UserRepositoryInterface";

export class TypeormUserRepository implements UserRepositoryInterface {
  userRepository: Repository<UserEntity>

  constructor() {
    this.userRepository = TypeormDataSource.getRepository(UserEntity)
  }

  async getUsers() {
    const savedUser = await this.userRepository.find()
    return savedUser
  }

  async findUser(email: string) {
    const user = await this.userRepository.findOneBy({ email: email})
    return user
  }

  async addUser(newUser: UserEntity) {
    const savedUser = await this.userRepository.save(newUser)
    return 
  }
}