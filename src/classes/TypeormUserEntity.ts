import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "typeorm_users" })
export class TypeormUserEntity {
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
