import { UserInterface } from "../types/UserInterface.types";
// import { TypeormUserEntity } from "./TypeormUserEntity";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import 'dotenv/config';

// export class UserEntity implements UserInterface {
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;

//   constructor(fields: UserInterface) {
//     Object.assign(this, fields);
//   }

//   static async createUser(fields: UserInterface) {
//     const newUser = new TypeormUserEntity;
//     Object.assign(newUser, fields);
//     return newUser
//   }
// }

@Entity({ name: "typeorm_users" })
export class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    length: 100,
  })
  email: string
  @Column({
    length: 100,
  })
  firstName: string
  @Column({
    length: 100,
  })
  lastName: string
  @Column({
    length: 100,
  })
  password: string
}
