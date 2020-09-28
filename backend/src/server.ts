import express, { Router } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import logger from "./config/logger";
import * as http from "http";
import Database from "./database";
import MainRouter from "./routes/mainRouter";

export default class Server {
    private app: express.Application;
    private port: number;
    private httpServer: http.Server;
    private router: Router;
    public db: Database;

    constructor(port?: number) {
        dotenv.config();
        this.port = port || 8080;
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());

        this.router = express.Router();
        this.db = new Database("url", "name");
        this.initServer();
    }

    public listen(): void {
        this.httpServer.listen(this.port, () => {
            logger.info(`Http server listening on port ${this.port}`);
        });
    }

    private initRoutes(): void {
        this.app.use("/", new MainRouter(this.db).router);
    }

    private async initServer(): Promise<void> {
        this.initRoutes();
    }
}