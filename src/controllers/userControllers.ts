import { Request, Response } from 'express';
import { FieldsInterface, checkMissingFields, checkPassword, hashPassword } from '../utils/helpers';
import { registerFieldErrors, loginFieldErrors } from '../utils/constants/FieldErrors';
import { UserEntity } from '../classes/UserEntity';
import { UserRepository } from '../index';
import { RegistrationEmail } from '../classes/RegistrationEmail';
import { sendRegistrationEmail } from '../utils/mailer';
import { AddUserInterface, FindUserInterface, GetUsersInterface } from '../types/UserRepositoryInterface';

export class GetUsersController {
  constructor(private userRepository: GetUsersInterface) {}

  async getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const users = await this.userRepository.getUsers()
      res.send(users);
    }
    catch (error) {
      return res.status(400).send(error);
    }
  }
}

export const getUsersHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new GetUsersController(UserRepository).getAllUsers(req, res);
};

export class RegisterUserController {
  constructor(private userRepository: AddUserInterface) {}

  async registerUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = await hashPassword(password)
    const fieldsFromReq = {
      email,
      firstName,
      lastName,
      password: hashedPassword
    };
    try {
      const missingCreds = checkMissingFields(fieldsFromReq, registerFieldErrors);
      if (missingCreds.length > 0) {
        return res.status(400).send(missingCreds);
      }
      const newUser = new UserEntity();
      Object.assign(newUser, fieldsFromReq);

      const userExists = await this.userRepository.findUser(newUser.email);
      if (userExists) {
        return res.status(400).send('User already exists.');
      } else {
        const addUserToDb = await this.userRepository.addUser(newUser)
        if(addUserToDb !== null) {
          const mailData = RegistrationEmail.getMailData({ email, firstName, lastName })
          const registerEmail = await sendRegistrationEmail(mailData);
          return res.status(200).send('You have successfully registered!').end();
        }
        else {
          return res.status(400).send('Something went wrong.');
        }
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export const registerUserHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new RegisterUserController(UserRepository).registerUser(req, res);
};

export class LoginUserController {
  constructor(private userRepository: FindUserInterface) {}

  async loginUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const { email, password } = req.body;
    const fieldsFromReq: FieldsInterface = {
      email,
      password
    };
    try {
      const missingCreds = checkMissingFields(fieldsFromReq, loginFieldErrors);
      if (missingCreds.length > 0) {
        return res.status(400).send(missingCreds);
      }
  
    const user = await this.userRepository.findUser(email);
    if (user) {
      const isPassordSame = await checkPassword(password, user.password)
      if (!isPassordSame) {
          return res.status(403).send('Incorrect password!');
        }
        return res.status(200).send('Login Successful!').end();
      } else {
        return res.status(400).send('User does not exist!');
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export const loginUserHandler = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  return new LoginUserController(UserRepository).loginUser(req, res);
};
