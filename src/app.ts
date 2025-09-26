import express from "express";
import cors from "cors";
import addRoutes from "./routes";
import dotenv from 'dotenv'

dotenv.config();

const servidor = express();

servidor.use(cors());
servidor.use(express.json());


addRoutes(servidor);

servidor.listen(process.env.PORT_SERVER? process.env.PORT_SERVER : 8081, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT_SERVER}`)
})