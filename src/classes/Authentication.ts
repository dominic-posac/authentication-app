import { AuthenticationInterface } from "../types/UserInterface.types";
import { authentication } from "../utils/helpers";

export class Authentication implements AuthenticationInterface {
  salt: string;
  password: string;

  constructor(salt: string, password: string) {
    this.salt = salt;
    this.password = authentication(salt, password);
  }
}

