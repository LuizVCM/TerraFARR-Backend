import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname + "/../models/*.{js,ts}"],
  migrations: [__dirname + "/../migrations/*.{js,ts}"],
  synchronize: true, // true -> ambiente de desenvolvimento, false -> ambiente de produção
  logging: true,
  ssl: { rejectUnauthorized: false }, // true -> certificado
  dateStrings: ["DATE"], // para não quebrar as datas (estavam sempre vindo com um dia anterior)
});