import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "posts" })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    length: 100,
  })
  title: string
  @Column("text")
  description: string
}

// TODO: add user ID???