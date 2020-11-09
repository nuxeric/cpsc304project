import express, { Router } from "express";
import Database from "../database";
import TestRoute from "./test/testRoute";

export default class MainRouter {
    public router: Router;
    private testRoute: TestRoute;

    constructor(db: Database) {
        this.router = express.Router();
        this.testRoute = new TestRoute(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.viewRoute();
        this.router.use("/test", this.testRoute.router);
    }

    private viewRoute(): void {
        this.router.get("/", (req, res) => {
            res.render('backend/page/index.ejs', { title: 'Warehouse Dashboard'} );
        });
    }
}
