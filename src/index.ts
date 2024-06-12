import express, { Application } from 'express';
import http, { Server as HTTPServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import 'dotenv/config';
import { getUsersHandler, registerUserHandler, loginUserHandler } from './controllers/userControllers';
import { addPostHandler, findPostHandler, getPostsHandler } from './controllers/postControllers';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { SqlUserRepository } from './repositories/SqlUserRepository';
import { TypeormPostRepository } from './repositories/TypeormPostRepository';
import { TypeormDataSource } from './typeorm-data-source';
import { TypeormUserRepository } from './repositories/TypeormUserRepository';

class Server {
  app: Application;
  server: HTTPServer;
  PORT: string | number;

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 8080;
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
    this.app.get("/", (req, res) => {res.send("Authentication app")}); // temporary, just for displaying something in "/"
    this.app.get("/users", getUsersHandler);
    this.app.post('/register', registerUserHandler);
    this.app.post('/login', loginUserHandler);
    this.app.get('/posts', getPostsHandler);
    this.app.get('/posts/:id', findPostHandler);
    this.app.post('/add-post', addPostHandler);
  }
}

export const UserRepository = process.env.ACTIVE_DB === "mysql" ? new SqlUserRepository() : process.env.ACTIVE_DB === "typeorm" ? new TypeormUserRepository() : new InMemoryUserRepository()
export const PostRepository = new TypeormPostRepository()
TypeormDataSource.initialize()

const server = new Server();
