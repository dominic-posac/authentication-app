import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import 'dotenv/config'

import { authentication, random } from './helpers';

const app = express();
const PORT = process.env.PORT
 
app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

const users: any[] = []

app.get("/users", (req, res) => {
  res.send(users);
});

app.post('/users', (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // check if req is complete
    if(!email || !password || !firstName || !lastName) {
      return res.status(400).send('missing credentials')
    }

    // check if user exists
    const existingUser = users.filter(user => user.email === email).length > 0
    if(existingUser) {
      return res.status(400).send('user already exists')
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

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(5)
    return res.status(400).send(error)
  }
});
