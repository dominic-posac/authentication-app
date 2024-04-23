import { DataSource } from "typeorm";
import { TypeormUserEntity } from "./classes/TypeormUserEntity";
import { TypeormPostEntity } from "./classes/TypeormPostEntity";
import "reflect-metadata"

export const TypeormDataSource = new DataSource({
  type: "mysql",
  // port: ,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [TypeormPostEntity, TypeormUserEntity],
  subscribers: [],
  migrations: [],
})
