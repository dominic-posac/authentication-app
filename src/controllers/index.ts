import { Request, Response } from 'express';
import { FieldsInterface, checkMissingFields, random } from '../utils/helpers';
import { registerFieldErrors, loginFieldErrors } from '../utils/constants/FieldErrors';
import { Authentication } from '../classes/Authentication';
import { UserEntity } from '../classes/UserEntity';
import { UserRepository } from '../index';
import { RegistrationEmail } from '../classes/RegistrationEmail';
import { sendRegistrationEmail } from '../utils/mailer';

export class GetUsersController {
  constructor(private req: Request, private res: Response) {}

  async getUsers() {
    const usersArr = UserRepository.getUsers()
    return usersArr
  }

  async getAllUsers(): Promise<Response<any, Record<string, any>>> {
    try {
      const users = await this.getUsers()
      this.res.send(users);
    }
    catch (error) {
      return this.res.status(400).send(error);
    }
  }
}

export const getUsersHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new GetUsersController(req, res).getAllUsers();
};

export class RegisterUserController {
  constructor(private req: Request, private res: Response) {}

  async addUser(newUser: UserEntity): Promise<void> {
    return UserRepository.addUser(newUser);
  }

  async registerUser(): Promise<Response<any, Record<string, any>>> {
    const { email, firstName, lastName, password } = this.req.body;
    const fieldsFromReq = {
      email,
      firstName,
      lastName,
    };
    try {
      const missingCreds = checkMissingFields({ ...fieldsFromReq, password }, registerFieldErrors);
      if (missingCreds.length > 0) {
        return this.res.status(400).send(missingCreds);
      }
      const salt = random();
      const fields = { ...fieldsFromReq, authentication: new Authentication(salt, password) };
      const newUser = await UserEntity.createUser(fields);
      if (!newUser) {
        return this.res.status(400).send('User already exists.');
      } else {
        const addUserToDb = await this.addUser(newUser)
        if(addUserToDb !== null) {
          const mailData = RegistrationEmail.getMailData({ email, firstName, lastName })
          const registerEmail = await sendRegistrationEmail(mailData);
          return this.res.status(200).send('You have successfully registered!').end();
        }
        else {
          return this.res.status(400).send('Something went wrong.');
        }
      }
    } catch (error) {
      return this.res.status(400).send(error);
    }
  }
}

export const registerUserHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new RegisterUserController(req, res).registerUser();
};

export class LoginUserController {
  constructor(private req: Request, private res: Response) {}

  async loginUser(): Promise<Response<any, Record<string, any>>> {
    const { email, password } = this.req.body;
    const fieldsFromReq: FieldsInterface = {
      email,
      password
    };
    try {
      const missingCreds = checkMissingFields(fieldsFromReq, loginFieldErrors);
      if (missingCreds.length > 0) {
        return this.res.status(400).send(missingCreds);
      }
  
    const user = await UserEntity.checkIfUserExists(email);
    if (user) {
        const passwordFromLoginHash = new Authentication(user.authentication.salt, password);
        if (user.authentication.password !== passwordFromLoginHash.password) {
          return this.res.status(403).send('Incorrect password!');
        }
        return this.res.status(200).send('Login Successful!').end();
      } else {
        return this.res.status(400).send('User does not exist!');
      }
    } catch (error) {
      return this.res.status(400).send(error);
    }
  }
}

export const loginUserHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new LoginUserController(req, res).loginUser();
};
