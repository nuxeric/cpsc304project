import logger from "./config/logger";
import {Client} from "pg";

export default class Database {
    public url: string;
    private dbName: string;
    private client;

    constructor(url: string, name: string) {
        this.url = url;
        this.dbName = name;
        this.client = new Client();
        this.setUpConnection();
        logger.info("database");
    }

    private async setUpConnection(): Promise<void> {
        const promise = this.client.connect();
        promise.then(() => {
            logger.info("The database has connected successfully")
        }).catch((error) => {
            logger.error(error)
            logger.error("your database has not connected successfully")
        });
    }
}