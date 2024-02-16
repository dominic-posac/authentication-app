import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { CredentialsInterface, UserCredentialsInterface, UserInterface } from 'types/UserInterface.types';
import { authentication, random } from './helpers';
import 'dotenv/config';
import { UserFields } from './constants/UserFields';
import { sendRegistrationEmail } from './utils/mailer';
import { getMailData } from './constants/MailData';

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

app.post('/users', async (req, res) => {
  const { email, firstName, lastName, password } = req.body
  const userCredentials: UserCredentialsInterface = {
    email,
    firstName,
    lastName,
    password
  }

  try {
    // check if req is complete
    const missingCreds: CredentialsInterface[] = []
    UserFields.map(userField => {
      const field = userField.field as keyof UserCredentialsInterface
      if(!userCredentials[field]) {
        missingCreds.push(userField)
      }
    })
    if(missingCreds.length > 0) {
      return res.status(400).send(missingCreds)
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

    // if(user creation is success)
    const registerEmail = await sendRegistrationEmail(getMailData({ email, firstName, lastName }))
    console.log(registerEmail)

    return res.status(200).send('You have successfully registered!').end();
  } catch (error) {
    return res.status(400).send(error)
  }
});
