import Database from "../database";

export default class Personnel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public birthdate: Date;
    public permissions: object;
    protected db: Database;

    // constructor(db: Database, id: number, firstName: string, lastName: string, birthdate: Date, permissions: object) {
    constructor(db: Database, id: number) {
      this.id = id;
      this.db = db;
      this.firstName = "";
      this.lastName = "";
      this.birthdate = new Date();
      this.permissions = {lineWoker: false, };
    }

}
