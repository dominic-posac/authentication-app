export interface AuthenticationInterface {
  salt: string;
  password: string;
}

export interface UserCredentialsInterface {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export interface UserInterface extends UserCredentialsInterface {
  authentication: AuthenticationInterface;
}

export interface CredentialsInterface {
  field: string;
  message: string;
}
