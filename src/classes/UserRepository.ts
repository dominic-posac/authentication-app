import { UserInterface } from "../types/UserInterface.types";

export class UserRepository  {
  users: UserInterface[];

  constructor() {
    this.users = [];
  }

  getUsers() {
    return this.users
  }

  findUser(email: string) {
    return this.users.find(user => user.email === email);
  }

  addUser(newUser: UserInterface) {
    this.users.push(newUser)
  }
}