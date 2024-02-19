import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import Server from './types/Server';
import Controller from './types/Controller';
import AuthController from './controllers/AuthController';
import 'dotenv/config';

const app: Application = express();
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

const PORT = process.env.PORT
const server: Server = new Server(app, PORT);

const controllers: Array<Controller> = [
  new AuthController(),
];


Promise.resolve()
  .then(() => {
    server.loadControllers(controllers);
    server.run();
  });
