import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import 'dotenv/config'
import mongoose from 'mongoose'
import router from './router';

const app = express();
 
app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)

server.listen(8080, () => {
  console.log('Server running on port 8080');
})

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.on('connected', () => console.log('mongoose connected'));

app.use('/', router());