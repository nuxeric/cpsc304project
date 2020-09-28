import ApiRoute from "../apiRoute";
import Database from "../../database";

export default class TestRoute extends ApiRoute {
    constructor(db: Database) {
        super(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.testRoute();
    }

    private testRoute(): void {
        this.router.get("/1", (req, res) => {
            res.send("GET TEST");
        });

        this.router.post("/1", (req, res) => {
            res.send("POST TEST");
        });
    }
}