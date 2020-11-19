import Database from "../database";
import Personnel from "./accounts/personnel";
import Permissions from "./accounts/permissions";

export default class Accounts {
    protected db: Database;

    constructor(db: Database) {
      this.db = db;
    }

    // Multiple personnel
    public async listPersonnel(): Promise<Array<Personnel>> {
      const query = {
        text:
          `SELECT *, CASE WHEN EXISTS(SELECT id FROM line_worker WHERE id = P.id)
                         THEN true
                         ELSE false
                     END AS line_worker,
                     CASE WHEN EXISTS(SELECT id FROM inventory_manager WHERE id = P.id)
                         THEN true
                         ELSE false
                     END AS inventory_manager,
                     CASE WHEN EXISTS(SELECT id FROM personnel_manager WHERE id = P.id)
                         THEN true
                         ELSE false
                     END AS personnel_manager,
                     CASE WHEN EXISTS(SELECT responsibilities FROM line_worker WHERE id = P.id)
                         THEN (SELECT responsibilities FROM line_worker WHERE id = P.id)
                         ELSE ''
                     END AS responsibilities,
                     CASE WHEN EXISTS(SELECT * FROM personnel_manager WHERE id = P.id)
                         THEN (SELECT number_of_employees_managed FROM personnel_manager WHERE id = P.id)
                         ELSE 0
                     END AS number_of_employees_managed
           FROM personnel P
           ORDER BY id`,
        values: [],
      };

      try {
        const result = await this.db.client.query(query)

        return result.rows.map(p => {
          return new Personnel(p.id, p.first_name, p.last_name,
            { lineWorker: p.line_worker, inventoryManager: p.inventory_manager, personnelManager: p.personnel_manager },
            p.birth_date, p.responsibilities, p.number_of_employees_managed);
        });
      } catch (e) {
        throw new Error('Could not get list of Personnel');
      }
    }

    // A single personnel
    public async getPersonnel(id: number): Promise<Personnel> {
      const query = {
        text:
          `SELECT *, CASE WHEN EXISTS(SELECT id FROM line_worker WHERE id = $1)
                         THEN true
                         ELSE false
                     END AS line_worker,
                     CASE WHEN EXISTS(SELECT id FROM inventory_manager WHERE id = $1)
                         THEN true
                         ELSE false
                     END AS inventory_manager,
                     CASE WHEN EXISTS(SELECT id FROM personnel_manager WHERE id = $1)
                         THEN true
                         ELSE false
                     END AS personnel_manager,
                     CASE WHEN EXISTS(SELECT * FROM line_worker WHERE id = $1)
                         THEN (SELECT responsibilities FROM line_worker WHERE id = $1)
                         ELSE ''
                     END AS responsibilities,
                     CASE WHEN EXISTS(SELECT * FROM personnel_manager WHERE id = $1)
                         THEN (SELECT number_of_employees_managed FROM personnel_manager WHERE id = $1)
                         ELSE 0
                     END AS number_of_employees_managed
           FROM personnel P
           WHERE id = $1`,
        values: [id],
      };

      try {
        const result = await this.db.client.query(query);
        const p = result.rows[0];

        if (p) {
          return new Personnel(p.id, p.first_name, p.last_name,
            { lineWorker: p.line_worker, inventoryManager: p.inventory_manager, personnelManager: p.personnel_manager },
            p.birth_date, p.responsibilities, p.number_of_employees_managed);
        } else {
          throw new Error(`Personnel #${id} does not exist`);
        }
      } catch (e) {
        throw new Error(`Could not get Personnel #${id}`);
      }
    }

    public async nextPersonnelID(): Promise<number> {
      const query = {
        text: 'SELECT MAX(id) FROM personnel',
        values: [],
      };

      try {
        const result = await this.db.client.query(query);
        const q = result.rows[0];

        if (q) {
          return q.max + 1;
        } else {
          throw new Error(`Could not get next max ID from personnel table`);
        }
      } catch (e) {
        throw new Error(`Could not get next max ID from personnel table`);
      }
    }

    // TODO: IDs are not autoincrementing, so we have to manually find the next
    // available ID. Would be great to not have to worry about that!
    public async createPersonnel(
      id: number | undefined,
      firstName: string,
      lastName: string,
      permissions: Permissions = new Permissions(false, false, false),
      birthDate: Date | undefined = undefined,
      responsibilities: string | undefined = undefined,
      employeesManaged: number | undefined = undefined): Promise<number>
    {
      if (id == undefined) {
        id = await this.nextPersonnelID();
      }

      try {
        await this.db.client.query('BEGIN');

        const personnelQuery = {
          text: `INSERT INTO personnel (id, birth_date, first_name, last_name)
                VALUES ($1, $2, $3, $4);`,
          values: [id, birthDate, firstName, lastName],
        };
        await this.db.client.query(personnelQuery);

        if (permissions.lineWorker) {
          const lineWorkerQuery = {
            text: `INSERT INTO line_worker (id, responsibilities)
                  VALUES ($1, $2);`,
            values: [id, responsibilities],
          };
          await this.db.client.query(lineWorkerQuery);
        }

        if (permissions.inventoryManager) {
          const inventoryManagerQuery = {
            text: `INSERT INTO inventory_manager (id)
                  VALUES ($1);`,
            values: [id],
          };
          await this.db.client.query(inventoryManagerQuery);
        }

        if (permissions.personnelManager) {
          if (employeesManaged == undefined) {
            employeesManaged = 0;
          }
          const personnelManagerQuery = {
            text: `INSERT INTO personnel_manager (id, number_of_employees_managed)
                  VALUES ($1, $2);`,
            values: [id, employeesManaged],
          };
          await this.db.client.query(personnelManagerQuery);
        }

        await this.db.client.query('COMMIT');

        return id;
      } catch (e) {
        console.log("Error while creating a Personnel: ", e);
        await this.db.client.query('ROLLBACK');
        throw e;
      }
    }

    public async updatePersonnel(
      id: number,
      firstName: string,
      lastName: string,
      permissions: Permissions,
      birthDate: Date | undefined = undefined,
      responsibilities: string | undefined = undefined,
      employeesManaged: number | undefined = undefined): Promise<Number>
    {
      try {
        await this.db.client.query('BEGIN');

        const updatePersonnelQuery = {
          text: `UPDATE personnel
                SET first_name = $2,
                    last_name = $3,
                    birth_date = $4
                WHERE id = $1;`,
          values: [id, firstName, lastName, birthDate],
        };
        await this.db.client.query(updatePersonnelQuery);

        if (permissions.lineWorker) {
          const updateLineWorkerQuery = {
            text: `INSERT INTO line_worker VALUES ($1, $2)
                   ON CONFLICT (id) DO UPDATE SET responsibilities = $2;`,
            values: [id, responsibilities],
          };
          await this.db.client.query(updateLineWorkerQuery);
        } else {
          const removeLineWorkerQuery = {
            text: `DELETE FROM line_worker WHERE ID = $1`,
            values: [id]
          };
          await this.db.client.query(removeLineWorkerQuery);
        }

        if (permissions.inventoryManager) {
          const updateInventoryManagerQuery = {
            text: `INSERT INTO inventory_manager VALUES ($1)
                   ON CONFLICT (id) DO NOTHING;`,
            values: [id],
          };
          await this.db.client.query(updateInventoryManagerQuery);
        } else {
          const removeLineWorkerQuery = {
            text: `DELETE FROM inventory_manager WHERE ID = $1`,
            values: [id]
          };
          await this.db.client.query(removeLineWorkerQuery);
        }

        if (permissions.personnelManager) {
          const updatePersonnelManagerQuery = {
            text: `INSERT INTO personnel_manager VALUES ($1, $2)
                   ON CONFLICT (id) DO UPDATE SET number_of_employees_managed = $2;`,
            values: [id, employeesManaged],
          };
          await this.db.client.query(updatePersonnelManagerQuery);
        } else {
          const removePersonnelManagerQuery = {
            text: `DELETE FROM personnel_manager WHERE ID = $1`,
            values: [id]
          };
          await this.db.client.query(removePersonnelManagerQuery);
        }

        await this.db.client.query('COMMIT');

        return id;
      } catch (e) {
        console.log(`Error while updating Personnel #${id}: `, e);
        await this.db.client.query('ROLLBACK');
        throw e;
      }
    }

    public async deletePersonnel(id: number): Promise<boolean> {
      try {
        await this.db.client.query('BEGIN');

        const removeLineWorkerQuery = {
          text: `DELETE FROM line_worker WHERE ID = $1`,
          values: [id]
        };

        const removeInventoryManagerQuery = {
          text: `DELETE FROM inventory_manager WHERE ID = $1`,
          values: [id]
        };
        await this.db.client.query(removeInventoryManagerQuery);

        const removePersonnelManagerQuery = {
          text: `DELETE FROM personnel_manager WHERE ID = $1`,
          values: [id]
        };
        await this.db.client.query(removePersonnelManagerQuery);

        const removePersonnelQuery = {
          text: `DELETE FROM personnel WHERE ID = $1`,
          values: [id]
        };
        await this.db.client.query(removePersonnelQuery);

        await this.db.client.query('COMMIT');

        return true;
      } catch (e) {
        console.log(`Error while deleting Personnel #${id}: `, e);
        await this.db.client.query('ROLLBACK');
        throw e;
      }
    }

    public personnelWhoWorkInEveryWarehouse(): Promise<Array<Personnel>> {
      const query = {
        text:
          `SELECT DISTINCT id, first_name, last_name
           FROM personnel P
           WHERE NOT EXISTS (
             SELECT DISTINCT W.id
             FROM warehouse W
             EXCEPT (
               SELECT DISTINCT N.warehouse_id
               FROM works_in N
               WHERE N.pid = P.id
             )
           );`,
        values: [],
      };

      let result = this.db.client.query(query)
      .then(res => {
        return res.rows.map(p => {
          return new Personnel(p.id, p.first_name, p.last_name);
        });
      });
      return result;
    }
}
