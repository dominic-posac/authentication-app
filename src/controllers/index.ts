import { Request, Response } from 'express';
import { FieldsInterface, checkMissingFields, random } from '../utils/helpers';
import { registerFieldErrors, loginFieldErrors } from '../utils/constants/FieldErrors';
import { Authentication } from '../classes/Authentication';
import { UserEntity } from '../classes/UserEntity';
import { users } from '../index';
import { RegistrationEmail } from '../classes/RegistrationEmail';
import { sendRegistrationEmail } from '../utils/mailer';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  res.send(users.getUsers());
}

export const registerUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> =>  {
  const { email, firstName, lastName, password } = req.body;
  const fieldsFromReq: FieldsInterface = {
    email,
    firstName,
    lastName,
    password
  };

  try {
    const missingCreds = checkMissingFields(fieldsFromReq, registerFieldErrors);
    if (missingCreds.length > 0) {
      return res.status(400).send(missingCreds);
    }
    const salt = random();
    const fields = {
      email,
      firstName,
      lastName,
      authentication: new Authentication(salt, password)
    };

    const newUser = UserEntity.createUser(fields);
    if(!newUser) {
      return res.status(400).send('User already exists.');
    }
    else {
      users.addUser(newUser);
      const mailData = RegistrationEmail.getMailData({ email, firstName, lastName })
      const registerEmail = await sendRegistrationEmail(mailData);
      return res.status(200).send('You have successfully registered!').end();
    }
  } catch (error) {
    return res.status(400).send(error);
  }
}

export const loginUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
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

  const user = UserEntity.checkIfUserExists(email);
  if (user) {
      const passwordFromLoginHash = new Authentication(user.authentication.salt, password);
      if (user.authentication.password !== passwordFromLoginHash.password) {
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