import Database from "../database";
import Personnel from "./accounts/personnel";

export default class Accounts {
    protected db: Database;

    constructor(db: Database) {
      this.db = db;
      console.log("created accounts instance");
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
                     END AS responsibilities
           FROM personnel P
           ORDER BY id`,
        values: [],
      };

      let result = this.db.client.query(query)
      .then(res => {

        return res.rows.map(p => {
          return new Personnel(p.id, p.first_name, p.last_name,
            { lineWorker: p.line_worker, inventoryManager: p.inventory_manager, personnelManager: p.personnel_manager },
            p.birth_date, p.responsibilities);
        });

      });

      return result;
    }

    // A single personnel
    public getPersonnel(id: number): Promise<Personnel> {
      const query = {
        // text: 'SELECT * FROM personnel WHERE id = $1',
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
                     CASE WHEN EXISTS(SELECT responsibilities FROM line_worker WHERE id = $1)
                         THEN (SELECT responsibilities FROM line_worker WHERE id = $1)
                         ELSE ''
                     END AS responsibilities
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
              p.birth_date, p.responsibilities);
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

}
