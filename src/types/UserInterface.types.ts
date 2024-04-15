export interface UserCredentialsInterface {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserInterface extends UserCredentialsInterface {
}

