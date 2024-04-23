import { UserInterface } from "../types/UserInterface.types";
import { TypeormUserEntity } from "./TypeormUserEntity";
import 'dotenv/config';

export class UserEntity implements UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  password: string;

  constructor(fields: UserInterface) {
    Object.assign(this, fields);
  }

  static async createUser(fields: UserInterface) {
    const newUser = new TypeormUserEntity;
    Object.assign(newUser, fields);
    return newUser
  }
}