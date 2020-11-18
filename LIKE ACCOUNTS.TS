LIKE ACCOUNTS.TS

import Database from "../database";
import Personnel from "./accounts/personnel";
import DividedPersonnel from "./divide_personnel/dividedPersonnel";

export default class PersonnelDivide {
    protected db: Database;

    constructor(db: Database) {
      this.db = db;
    }

    // Multiple personnel
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

LIKE PERSONNEL.TS

export default class DividedPersonnel {
    public id: number;
    public firstName: string;
    public lastName: string;

    constructor(
      id: number,
      firstName: string = "",
      lastName: string = "")
    {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
    }
}



this.router.get("/", (req, res) => {
            this.divided_personnel.listDividedPersonnel()
            .then(personnel_after_divide => {
                res.render('web/page/personnel/after_divide.ejs', { 
                    title: "Personnel", 
                    personnel_after_divide: personnel_after_divide 
                });
            })
            .catch(e => console.error(e.stack));
        });*/