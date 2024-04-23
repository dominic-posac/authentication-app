import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "typeorm_posts" })
export class TypeormPostEntity {
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