import { Request, Response } from 'express';
import { FieldsInterface, authentication, checkIfUserExists, checkMissingFields, random } from '../utils/helpers';
import { loginFieldErrors, registerFieldErrors } from '../utils/constants/FieldErrors'
import { UserInterface } from '../types/UserInterface.types';
import Controller, { Methods } from '../types/Controller';
import { sendRegistrationEmail } from '../utils/mailer';
import { getMailData } from '../utils/constants/MailData';

// update to class component?
const users: UserInterface[] = [
  // test user
  {
    "email": "dominic@positiveaction.ph",
    "firstName": "Dominic",
    "lastName": "Cruz",
    "authentication": {
      "salt": "QnYrg66yi9p/j8diTFE+Jl3RLjJQvnJ4hZ+WX4pQoJo6fzUuxWZZdNyM9aNeDXeNTQJgEcA7ulSVFmTmdAxv0sWYxxEKnZ2GSx4o/n247cJj+a9U8J8srUPwOao8FJhEc+W46Ap2oa/LNrsIcnQL29hP+umZBqaGXl65ze+15W4=",
      "password": "f22f89265c8b9a2bffe00bd88d30c2992212bdbbf87125a1daae723ba601a4d7"
    }
  }
];

export default class AuthController extends Controller {
  path = '/';
  routes = [
    {
      path: '/users',
      method: Methods.GET,
      handler: this.handleGetUsers,
    },
    {
      path: '/login',
      method: Methods.POST,
      handler: this.handleLogin,
    },
    {
      path: '/register',
      method: Methods.POST,
      handler: this.handleRegister,
    },
  ];

  constructor() {
    super();
  }

  async handleGetUsers(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.send(users);
  }

  async handleLogin(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { email, password } = req.body
    const fieldsFromReq: FieldsInterface = {
      email,
      password
    }
    try {
    // check if req is complete
      const missingCreds = checkMissingFields(fieldsFromReq, loginFieldErrors)
      if(missingCreds.length > 0) {
        res.status(400).send(missingCreds)
      }
      // check if user exists
      const user = checkIfUserExists(users, email)
      if(user) {
        // compare password hash
        const passwordFromLoginHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== passwordFromLoginHash) {
          res.status(403).send('Incorrect password!')
        }
        // if password match, login success, send token?
        res.status(200).send('Login Successful!').end();
      }
      else {
        res.status(400).send('User does not exist!')
      }
    } catch (error) {
      res.status(400).send(error)
    }
  }

  async handleRegister(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { email, firstName, lastName, password } = req.body
    const fieldsFromReq: FieldsInterface = {
      email,
      firstName,
      lastName,
      password
    }

    try {
      // check if req is complete
      const missingCreds = checkMissingFields(fieldsFromReq, registerFieldErrors)
      if(missingCreds.length > 0) {
        res.status(400).send(missingCreds)
      }

      if(checkIfUserExists(users, email)) {
        res.status(400).send('User already exists.')
      }
      
      // "create" user
      const salt = random();
      const user = {
        email,
        firstName,
        lastName,
        authentication: {
          salt,
          password: authentication(salt, password)
        }
      }
      users.push(user)

      // if(user creation is success)
      const registerEmail = await sendRegistrationEmail(getMailData({ email, firstName, lastName }))
      console.log(registerEmail)

      res.status(200).send('You have successfully registered!').end();
    } catch (error) {
      res.status(400).send(error)
    }
  }
}
