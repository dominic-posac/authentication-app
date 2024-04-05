import { UserInterface } from "../types/UserInterface.types";
import { Authentication } from "./Authentication";
import { UserRepository } from "../index";

export class UserEntity implements UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  authentication: Authentication;

  constructor(fields: UserInterface) {
    Object.assign(this, fields);
  }

  static async checkIfUserExists(email: string) {
    if(!email) {
      return null
    }
    return UserRepository.findUser(email);
  }

  static async createUser(fields: UserInterface) {
    const existingUser = await this.checkIfUserExists(fields.email)
    if (existingUser) {
      return null
    }
    return new UserEntity(fields)
  }
}