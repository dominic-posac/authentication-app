import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { UserInterface } from 'types/UserInterface.types';
import { authentication, normalizeCamelCase, random } from './helpers';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

const users: UserInterface[] = []

app.get("/users", (req, res) => {
  res.send(users);
});

app.post('/users', (req, res) => {
  const { email, firstName, lastName, password } = req.body
  const userCredentials = {
    email,
    firstName,
    lastName,
    password
  }

  try {
    // check if req is complete
    const missingCreds: string[] = []
    Object.entries(userCredentials).map(userCredential => {
      if(!userCredential[1]) {
        const formattedCredential = normalizeCamelCase(userCredential[0])
        missingCreds.push(formattedCredential)
      }
    })
    if(missingCreds.length > 0) {
      return res.status(400).send(`The following are required: ${missingCreds.join(', ')}`)
    }

    // check if user exists
    const existingUser = users.filter(user => user.email === email).length > 0
    if(existingUser) {
      return res.status(400).send('User already exists.')
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

    return res.status(200).send('You have successfully registered!').end();
  } catch (error) {
    return res.status(400).send(error)
  }
});
