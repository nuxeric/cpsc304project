import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";

export default class PersonnelRoute extends ApiRoute {
    constructor(db: Database) {
        super(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.personnelRoute();
    }

    private personnelRoute(): void {
        this.router.post("/create", (req, res) => {
          const args = res.json(req.body);
          res.send(args);
            // res.send("Created: " + req.params.first_name + " " + req.params.last_name);
        });
    }
}
