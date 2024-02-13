export interface AuthenticationInterface {
  salt: string;
  password: string;
}

export interface UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  authentication: AuthenticationInterface;
}

