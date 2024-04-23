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
    const typeormUser = new TypeormUserEntity;
    Object.assign(typeormUser, fields);
    const user = new UserEntity(fields)
// return process.env.ACTIVE_DB === "typeorm" ? typeormUser : user
    return typeormUser
  }
}