import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
      if(!email || !password || !firstName || !lastName) {
      console.log('missing credential')
      return res.sendStatus(400)
    }

    const existingUser = await getUserByEmail(email)
    if(existingUser) {
      console.log('user already exists')
      return res.sendStatus(400)
    }

    const salt = random();
    const user = await createUser({
      email,
      firstName,
      lastName,
      authentication: {
        salt,
        password: authentication(salt, password)
      }
    })

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400)
  }
}