import { UserInterface } from "../types/UserInterface.types";

export class UserEntity implements UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  password: string;

  constructor(fields: UserInterface) {
    Object.assign(this, fields);
  }

  static async createUser(fields: UserInterface) {
    return new UserEntity(fields)
  }
}