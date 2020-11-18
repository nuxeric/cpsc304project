import Database from "../database";
import Personnel from "./accounts/personnel";
import Permissions from "./accounts/permissions";

export default class Accounts {
    protected db: Database;

    constructor(db: Database) {
      this.db = db;
    }

    // Multiple personnel
    public listPersonnel(): Promise<Array<Personnel>> {
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

      let result = this.db.client.query(query)
      .then(res => {

        return res.rows.map(p => {
          return new Personnel(p.id, p.first_name, p.last_name,
            { lineWorker: p.line_worker, inventoryManager: p.inventory_manager, personnelManager: p.personnel_manager },
            p.birth_date, p.responsibilities, p.number_of_employees_managed);
        });

      });

      return result;
    }

    // A single personnel
    public getPersonnel(id: number): Promise<Personnel> {
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

      let result = this.db.client.query(query)
        .then(res => {
          const p = res.rows[0];
          if (p) {
            return new Personnel(p.id, p.first_name, p.last_name,
              { lineWorker: p.line_worker, inventoryManager: p.inventory_manager, personnelManager: p.personnel_manager },
              p.birth_date, p.responsibilities, p.number_of_employees_managed);
          } else {
            throw new Error(`Personnel #${id} does not exist`)
          }
        });

      return result;
    }

    public nextPersonnelID(): Promise<number> {
      const query = {
        text: 'SELECT MAX(id) FROM personnel',
        values: [],
      };

      let result = this.db.client.query(query)
        .then(res => {
          const q = res.rows[0];
          if (q) {
            return q.max + 1;
          } else {
            throw new Error(`Could not get next max ID from personnel table`)
          }
        });

      return result;
    }

    // TODO: IDs are not autoincrementing, so we have to manually find the next
    // available ID. Would be great to not have to worry about that!
    public createPersonnel(
      id: number | undefined,
      firstName: string,
      lastName: string,
      permissions: Permissions = new Permissions(false, false, false),
      birthDate: Date | undefined = undefined,
      responsibilities: string | undefined = undefined,
      employeesManaged: number | undefined = undefined): Promise<number>
    {
      let result =
        this.nextPersonnelID()
        .then(nextID => {
          if (id == undefined) {
            id = nextID;
          }
          const query = {
            text: `INSERT INTO personnel (id, birth_date, first_name, last_name)
                   VALUES ($1, $2, $3, $4);`,
            values: [id, birthDate, firstName, lastName],
          };
          return this.db.client.query(query)
        })
        .then(res => {
          if (!permissions.lineWorker) {
            return new Promise((resolve, reject) => resolve());
          }
          const query = {
            text: `INSERT INTO line_worker (id, responsibilities)
                   VALUES ($1, $2);`,
            values: [id, responsibilities],
          };
          return this.db.client.query(query)
        })
        .then(res => {
          if (!permissions.inventoryManager) {
            return new Promise((resolve, reject) => resolve());
          }
          const query = {
            text: `INSERT INTO inventory_manager (id)
                   VALUES ($1);`,
            values: [id],
          };
          return this.db.client.query(query)
        })
        .then(res => {
          if (!permissions.personnelManager) {
            return new Promise((resolve, reject) => resolve());
          }
          const query = {
            text: `INSERT INTO personnel_manager (id, number_of_employees_managed)
                   VALUES ($1, $2);`,
            values: [id, employeesManaged],
          };
          return this.db.client.query(query)
        })
        .then(res => {
          return new Promise<number>((resolve) => resolve(id));
        });

        return result;
    }

    public updatePersonnel(
      id: number,
      firstName: string,
      lastName: string,
      permissions: Permissions,
      birthDate: Date | undefined = undefined,
      responsibilities: string | undefined = undefined,
      employeesManaged: number | undefined = undefined): Promise<Number>
    {
      const updatePersonnelQuery = {
        text: `UPDATE personnel
               SET first_name = $2,
                   last_name = $3,
                   birth_date = $4
               WHERE id = $1;`,
        values: [id, firstName, lastName, birthDate],
      };

      let result = this.db.client.query(updatePersonnelQuery)
        .then(res => {
          if (permissions.lineWorker) {
            const updateLineWorkerQuery = {
              text: `INSERT INTO line_worker VALUES ($1, $2)
                     ON CONFLICT (id) DO UPDATE SET responsibilities = $2;`,
              values: [id, responsibilities],
            };
            return this.db.client.query(updateLineWorkerQuery);
          } else {
            const removeLineWorkerQuery = {
              text: `DELETE FROM line_worker WHERE ID = $1`,
              values: [id]
            };
            return this.db.client.query(removeLineWorkerQuery);
          }
        })
        .then(res => {
          if (permissions.inventoryManager) {
            const updateInventoryManagerQuery = {
              text: `INSERT INTO inventory_manager VALUES ($1)
                     ON CONFLICT (id) DO NOTHING;`,
              values: [id],
            };
            return this.db.client.query(updateInventoryManagerQuery);
          } else {
            const removeLineWorkerQuery = {
              text: `DELETE FROM inventory_manager WHERE ID = $1`,
              values: [id]
            };
            return this.db.client.query(removeLineWorkerQuery);
          }
        })
        .then(res => {
          if (permissions.personnelManager) {
            const updatePersonnelManagerQuery = {
              text: `INSERT INTO personnel_manager VALUES ($1, $2)
                     ON CONFLICT (id) DO UPDATE SET number_of_employees_managed = $2;`,
              values: [id, employeesManaged],
            };
            return this.db.client.query(updatePersonnelManagerQuery);
          } else {
            const removePersonnelManagerQuery = {
              text: `DELETE FROM personnel_manager WHERE ID = $1`,
              values: [id]
            };
            return this.db.client.query(removePersonnelManagerQuery);
          }
        })
        .then(res => {
          return new Promise<number>((resolve) => resolve(id));
        });

        return result;
    }

    public deletePersonnel(id: number): Promise<boolean> {
      const removeLineWorkerQuery = {
        text: `DELETE FROM line_worker WHERE ID = $1`,
        values: [id]
      };

      let result = this.db.client.query(removeLineWorkerQuery)
        .then(res => {
          const removeInventoryManagerQuery = {
            text: `DELETE FROM inventory_manager WHERE ID = $1`,
            values: [id]
          };
          return this.db.client.query(removeInventoryManagerQuery);
        })
        .then(res => {
          const removePersonnelManagerQuery = {
            text: `DELETE FROM personnel_manager WHERE ID = $1`,
            values: [id]
          };
          return this.db.client.query(removePersonnelManagerQuery);
        })
        .then(res => {
          const removePersonnelQuery = {
            text: `DELETE FROM personnel WHERE ID = $1`,
            values: [id]
          };
          return this.db.client.query(removePersonnelQuery);
        })
        .then(res => {
          return new Promise<boolean>((resolve) => resolve(true));
        });

        return result;
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
