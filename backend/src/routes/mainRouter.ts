import express, { Router } from "express";
import testRoute from "./test/testRoute";
import Database from "../database";
import TestRoute from "./test/testRoute";

export default class MainRouter {
    public router: Router;
    private testRoute: testRoute;

    constructor(db: Database) {
        this.router = express.Router();
        this.testRoute = new TestRoute(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use("/test", this.testRoute.router);
    }
}