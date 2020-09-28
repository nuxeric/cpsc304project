import logger from "./config/logger";

export default class Database {
    public url: string;
    private dbName: string;

    constructor(url: string, name: string) {
        this.url = url;
        this.dbName = name;
        logger.info("database");
    }
}