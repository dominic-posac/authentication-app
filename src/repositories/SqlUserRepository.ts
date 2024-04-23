import { pool } from "../database";
import { UserInterface } from "../types/UserInterface.types";
import { UserRepositoryInterface } from "../types/UserRepositoryInterface";
import { UserEntity } from "../classes/UserEntity";
import { RowDataPacket } from "mysql2";

interface SqlUserInterface extends UserEntity, RowDataPacket {}

export class SqlUserRepository implements UserRepositoryInterface {
  async getUsers() {
    const [users] = await pool.query<SqlUserInterface[]>("SELECT * FROM users")
    return users
  }

  async findUser(email: string) {
    const [user] = await pool.query<SqlUserInterface[]>(`SELECT * FROM users where email = ?`, email)
    return user[0]
  }

  async addUser(newUser: UserInterface) { 
    const { email, firstName, lastName, password = 'asdf' } = newUser;

    const registerUser = await pool.query<SqlUserInterface[]>(`
      INSERT INTO users (email, firstName, lastName, password)
      VALUES (?, ?, ?, ?)
    `, [email, firstName, lastName, password])

    return 
  }
}