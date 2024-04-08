import { UserInterface } from "../types/UserInterface.types";
import { UserRepositoryInterface } from "./UserRepositoryInterface";

export class InMemoryUserInterface implements UserRepositoryInterface {
  users: UserInterface[];

  constructor() {
    this.users = [];
  }

  async getUsers() {
    return this.users
  }

  async findUser(email: string) {
    return this.users.find(user => user.email === email);
  }

  async addUser(newUser: UserInterface) {
    this.users.push(newUser)
    return
  }
}