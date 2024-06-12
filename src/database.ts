import mysql from "mysql2"
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}).promise()

// use this when launching via docker // TODO: replace this with mysql entrypoint in docker-compose
// pool.query("CREATE TABLE `authentication-app`.`users` (`id` INT NOT NULL AUTO_INCREMENT,`email` VARCHAR(100) NOT NULL,`firstName` VARCHAR(100) NOT NULL,`lastName` VARCHAR(100) NOT NULL,`password` VARCHAR(100) NOT NULL,PRIMARY KEY (`id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)")