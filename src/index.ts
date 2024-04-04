import express, { Application, Request, Response } from 'express';
import http, { Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { UserInterface } from 'types/UserInterface.types';
import 'dotenv/config';
import { getUsers, registerUser, loginUser } from './controllers';

export const users: UserInterface[] = []

class Server {
  app: Application;
  server: HTTPServer;
  PORT: string | number;

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
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
    this.app.get("/users", getUsers);
    this.app.post('/register', registerUser);
    this.app.post('/login', loginUser);
  }
}

const server = new Server();