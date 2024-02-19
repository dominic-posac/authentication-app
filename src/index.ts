import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { UserInterface } from 'types/UserInterface.types';
import { FieldsInterface, authentication, checkIfUserExists, checkMissingFields, random } from './utils/helpers';
import 'dotenv/config';
import { loginFieldErrors, registerFieldErrors } from './utils/constants/FieldErrors';
import { sendRegistrationEmail } from './utils/mailer';
import { getMailData } from './utils/constants/MailData';

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
]

app.get("/users", (req, res) => {
  res.send(users);
});

app.post('/register', async (req, res) => {
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
      return res.status(400).send(missingCreds)
    }

    if(checkIfUserExists(users, email)) {
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const fieldsFromReq: FieldsInterface = {
    email,
    password
  }

  try {
    // check if req is complete
    const missingCreds = checkMissingFields(fieldsFromReq, loginFieldErrors)
    if(missingCreds.length > 0) {
      return res.status(400).send(missingCreds)
    }
    // check if user exists
    const user = checkIfUserExists(users, email)
    if(user) {
      // compare password hash
      const passwordFromLoginHash = authentication(user.authentication.salt, password);
      if(user.authentication.password !== passwordFromLoginHash) {
        return res.status(403).send('Incorrect password!')
      }
      // if password match, login success, send token?
      return res.status(200).send('Login Successful!').end();
    }
    else {
      return res.status(400).send('User does not exist!')
    }
  } catch (error) {
    return res.status(400).send(error)
  }
});