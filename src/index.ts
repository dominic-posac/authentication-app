import express, { Application } from 'express';
import http, { Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import 'dotenv/config';
import { getUsersHandler, registerUserHandler, loginUserHandler } from './controllers';
import { InMemoryUserInterface } from './repositories/InMemoryUserInterface';

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
    this.app.get("/users", getUsersHandler);
    this.app.post('/register', registerUserHandler);
    this.app.post('/login', loginUserHandler);
  }
}

export const UserRepository = new InMemoryUserInterface();
const server = new Server();
