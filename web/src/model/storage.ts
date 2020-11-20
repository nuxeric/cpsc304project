import Database from "../database";
import Inventory from "./storage/inventory";

export default class Storage {
    protected db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public async selectInventoryAndProject() {
        const query = {
            text:
                `SELECT serial_num, container_id, type_name, weight FROM inventory`,
            values: [],
        };

        try {
            const result = await this.db.client.query(query)
            return result.rows.map(i => {
                return new Inventory(i.serial_num, i.container_id, i.type_name, i.weight, undefined);
            });
        } catch (e) {
            throw new Error('Could not get list of Personnel');
        }
    }
}
