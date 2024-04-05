import { UserEntity } from "../classes/UserEntity";

export interface GetUsersInterface {
  getUsers(): Promise<UserEntity[]>;
}

export interface FindUserInterface {
  findUser(email: string): Promise<UserEntity>;
}

export interface AddUserInterface extends FindUserInterface {
  addUser(newUser: UserEntity): Promise<void>;
}

export interface UserRepositoryInterface extends GetUsersInterface, AddUserInterface {}