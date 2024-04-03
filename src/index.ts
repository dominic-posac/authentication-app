import express, { Application, Request, Response } from 'express';
import http, { Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { UserInterface } from 'types/UserInterface.types';
import { FieldsInterface, authentication, checkIfUserExists, checkMissingFields, random } from './utils/helpers';
import 'dotenv/config';
import { loginFieldErrors, registerFieldErrors } from './utils/constants/FieldErrors';
import { sendRegistrationEmail } from './utils/mailer';
import { getMailData } from './utils/constants/MailData';

class Authentication {
  salt: string;
  password: string;

  constructor(salt: string, password: string) {
    this.salt = salt;
    this.password = password;
  }
}

class User {
  email: string;
  firstName: string;
  lastName: string;
  authentication: Authentication;

  constructor(fields: UserInterface) {
    this.email = fields.email;
    this.firstName = fields.firstName;
    this.lastName = fields.lastName;
    this.authentication = new Authentication(fields.authentication.salt, fields.authentication.password);
  }
}

class Server {
  app: Application;
  server: HTTPServer;
  PORT: string | number;
  users: UserInterface[];

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
    this.users = [];
    this.setupServer();
  }

  setupServer(): void {
    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    this.server = http.createServer(this.app);

    this.server.listen(this.PORT, () => {
      console.log(`Server running on port ${this.PORT}`);
    });

    this.setupRoutes();
  }

  setupRoutes(): void {
    this.app.get("/users", this.getUsers.bind(this));
    this.app.post('/register', this.registerUser.bind(this));
    this.app.post('/login', this.loginUser.bind(this));
  }

  getUsers(req: Request, res: Response): void {
    res.send(this.users);
  }

  async registerUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
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

      if (checkIfUserExists(this.users, email)) {
        return res.status(400).send('User already exists.');
      }

      const salt = random();
      const fields = {
        email,
        firstName,
        lastName,
        authentication: {
          salt,
          password: authentication(salt, password)
        }
      };
      const newUser = new User(fields);
      this.users.push(newUser);

      const registerEmail = await sendRegistrationEmail(getMailData({ email, firstName, lastName }));
      console.log(registerEmail);

      return res.status(200).send('You have successfully registered!').end();
    } catch (error) {
      return res.status(400).send(error);
    }
  }

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

      const user = checkIfUserExists(this.users, email);
      if (user) {
        const passwordFromLoginHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== passwordFromLoginHash) {
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

const server = new Server();