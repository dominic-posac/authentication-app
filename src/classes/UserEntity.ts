import { UserInterface } from "../types/UserInterface.types";
import { Authentication } from "./Authentication";

export class UserEntity implements UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  authentication: Authentication;

  constructor(fields: UserInterface) {
    Object.assign(this, fields);
  }

  static async createUser(fields: UserInterface) {
    return new UserEntity(fields)
  }
}