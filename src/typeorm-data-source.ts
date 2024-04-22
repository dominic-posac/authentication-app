import { PostEntity } from "./classes/PostEntity";
import "reflect-metadata"
import { DataSource } from "typeorm";

export const TypeormDataSource = new DataSource({
  type: "mysql",
  // port: ,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [PostEntity],
  subscribers: [],
  migrations: [],
})
