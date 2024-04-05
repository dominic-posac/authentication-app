import { UserEntity } from "../classes/UserEntity";

export interface GenericRepositoryInterface {
  getUsers(): Promise<UserEntity[]>;
  findUser(email: string): Promise<UserEntity>;
  addUser(newUser: UserEntity): Promise<void>;
}