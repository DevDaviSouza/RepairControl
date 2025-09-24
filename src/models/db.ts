import { Sequelize } from "sequelize";
import initModels from "./init-models";
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(
  process.env.NAME_DB || '',
  process.env.USER_DB ||'',
  process.env.PASSWORD_DB||'',
  {
  host: process.env.HOST_DB,
  port: Number(process.env.PORT),
  dialect: 'postgres',
  logging: console.log,
})

const db = initModels(sequelize)

export default db