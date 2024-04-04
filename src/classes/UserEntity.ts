import { UserInterface } from "../types/UserInterface.types";
import { Authentication } from "./Authentication";
import { users } from "../index";

export class UserEntity implements UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  authentication: Authentication;

  constructor(fields: UserInterface) {
    Object.assign(this, fields);
  }

  static checkIfUserExists(email: string) {
    if(!email) {
      return null
    }
    return users.findUser(email);
  }

  static createUser(fields: UserInterface) {
    const existingUser = this.checkIfUserExists(fields.email)
    if (existingUser) {
      return null
    }
    return new UserEntity(fields)
  }
}