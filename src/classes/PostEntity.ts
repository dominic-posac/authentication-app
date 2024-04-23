import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { PostInterface } from "types/PostInterface.types"

@Entity({ name: "typeorm_posts" })
export class PostEntity implements PostInterface {
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