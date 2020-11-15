import Database from "../database";
import Personnel from "./accounts/personnel";
import Permissions from "./accounts/permissions";

export default class Accounts {
    protected db: Database;

    constructor(db: Database) {
      this.db = db;
    }

    public someQuery(): void {
      this.db.client
        .query('SELECT NOW() as now')
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))
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

    public getResponsibilities(id: number): Promise<string> {
      const query = {
        text: 'SELECT responsibilities FROM line_worker WHERE id = $1',
        values: [id],
      };

      let result = this.db.client.query(query)
        .then(res => {
          const q = res.rows[0];
          if (q) {
            return q.responsibilities;
          } else {
            throw new Error(`Personnel #${id} does not have line worker permissions`)
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

    // public updateUser(
    //   id: number | undefined,
    //   firstName: string,
    //   lastName: string,
    //   permissions: Permissions
    //   birthDate: Date | undefined = undefined,
    //   responsibilities: string | undefined = undefined,
    //   employeesManaged: number | undefined = undefined): Promise<Number>
    // {
    //   return new Promise<number>((resolve) => resolve(id))
    // }

    // public deleteUser() {

    // }
}
