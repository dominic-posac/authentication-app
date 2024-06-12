import { UserInterface } from "../types/UserInterface.types";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import 'dotenv/config';

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
