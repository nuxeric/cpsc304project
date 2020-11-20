import Database from "../database";
import Inventory from "./storage/inventory";
import Warehouse from "./storage/warehouse";

export default class Storage {
    protected db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public async selectInventoryAndProject(): Promise<Array<Inventory>> {
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
            throw new Error('Could not get list of Inventory');
        }
    }

    public async joinInventoryAndStorageContainerOnContainerID(containerID: number): Promise<Inventory[]> {
        const query = {
            text:
                `SELECT I.serial_num, I.container_id, I.type_name, I.weight, I.manufacture_date
                FROM inventory I, storage_container S
                WHERE S.id = $1 AND I.container_id = S.id`,
            values: [containerID],
        };

        try {
            const result = await this.db.client.query(query)
            return result.rows.map(i => {
                return new Inventory(i.serial_num, i.container_id, i.type_name, i.weight, i.manufacture_date);
            });
        } catch (e) {
            throw new Error('Could not get list of Inventory');
        }
    }

    /**
      * Returns a list of objects, each with the keys:
      * - typeName
      * - count
      * - volume
      */
    public async inventoryTypesWithSmallerThanAverageVolume(): Promise<Array<Object>> {
      const query = {
          text:
              `SELECT IT.type_name, COUNT(*) as count, (IT.height * IT.width * IT.length) as volume
               FROM inventory_type IT, inventory I
               WHERE I.type_name = IT.type_name
               GROUP BY IT.type_name
               HAVING (IT.height * IT.width * IT.length) < (
                 SELECT AVG(height * width * length)
                 FROM inventory_type
               )
               ORDER BY count DESC, volume ASC;`,
          values: [],
      };

        try {
            const result = await this.db.client.query(query)
            return result.rows.map(row => {
                return { typeName: row.type_name, count: row.count, volume: row.volume };
            });
        } catch (e) {
            throw new Error('Failed to query inventory types with smaller than average volume');
        }
    }

    /**
      * Returns a list of objects, each with keys:
      * - warehouse (a Warehouse object)
      * - containerCount (the number of containers in that warehouse)
      */
    public async warehouseContainerCounts(): Promise<Array<Object>> {
        const query = {
            text:
                `SELECT W.*, COUNT(*) as container_count
                FROM storage_container S, warehouse W
                WHERE W.id = S.warehouse_id
                GROUP BY W.id`,
            values: [],
        };

        try {
            const result = await this.db.client.query(query)
            return result.rows.map(w => {
                return {
                    warehouse: new Warehouse(w.id, w.total_volume, w.occupied_volume, w.street_address, w.postal_code),
                    containerCount: w.container_count
                };
            });
        } catch (e) {
            throw new Error('Failed to query number of containers per warehouse');
        }
    }
}
