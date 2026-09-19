import express, { Application } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import router from "./routes/index.routes";
import { errorHandler } from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { insertPlants } from "./config/seed/plant.seeder";
const app: Application = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://localhost:5501", "http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }) 
 
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Banco conectado com sucesso");
    await insertPlants();
    console.log("Dados inseridos com sucesso");
    app.use(errorHandler);
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar aplicação: ", error);
  }
}
startServer();