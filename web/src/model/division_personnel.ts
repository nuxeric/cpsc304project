import Database from "../database";
import DividedPersonnel from "./division/personnel_divided";

export default class PersonnelDivide {
    protected db: Database;

    constructor(db: Database) {
      this.db = db;
    }

    public listDividedPersonnel(): Promise<Array<DividedPersonnel>> {
      const query = {
        text:
          `SELECT DISTINCT id, first_name, last_name
          FROM personnel P
          WHERE NOT EXISTS
                      ((SELECT DISTINCT W.id
                        FROM warehouse W)
                        EXCEPT
                        (SELECT DISTINCT N.warehouse_id
                        FROM works_in N
                        WHERE N.pid = P.id));`,
        values: [],
      };

      let result = this.db.client.query(query)
      .then(res => {
        return res.rows.map(p => {
          return new DividedPersonnel(p.id, p.first_name, p.last_name);
        });
      });
      return result;
    }
}