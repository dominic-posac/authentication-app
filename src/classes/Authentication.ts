import { authentication } from "../utils/helpers";

export class Authentication {
  salt: string;
  password: string;

  constructor(salt: string, password: string) {
    this.salt = salt;
    this.password = authentication(salt, password);
  }
}

