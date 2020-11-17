import logger from "./config/logger";
import {Client} from "pg";

export default class Database {
    public client;

    constructor() {
        this.client = new Client();
        this.setUpConnection();
    }

    private async setUpConnection(): Promise<void> {
        logger.info("Connecting to database...");

        const promise = this.client.connect();
        promise.then(() => {
            logger.info("Connected to database successfully!")
        }).catch((error) => {
            logger.error(error)
            logger.error("Failed to connect to the database!")
        });
    }
}
