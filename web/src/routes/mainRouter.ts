import express, { Router } from "express";
import Database from "../database";
import TestRoute from "./test/testRoute";
import PersonnelRoute from "./personnel/personnelRoute";
import DividerRoute from "./divider/dividerRoute";
import InventoryRoute from "./inventory/inventoryRoute";

export default class MainRouter {
    public router: Router;
    private testRoute: TestRoute;
    private personnelRoute: PersonnelRoute;
    private dividerRoute: DividerRoute;
    private inventoryRoute: InventoryRoute;

    constructor(db: Database) {
        this.router = express.Router();
        this.testRoute = new TestRoute(db);
        this.personnelRoute = new PersonnelRoute(db);
        this.dividerRoute = new DividerRoute(db);
        this.inventoryRoute = new InventoryRoute(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.viewRoute();
        this.router.use("/test", this.testRoute.router);
        this.router.use("/personnel", this.personnelRoute.router);
        this.router.use("/divider", this.dividerRoute.router);
        this.router.use("/inventory", this.inventoryRoute.router);
    }

    private viewRoute(): void {
        this.router.get("/", (req, res) => {
            res.render('web/page/index.ejs', { title: 'Warehouse Dashboard'} );
        });

        this.router.get("/about", (req, res) => {
            res.render('web/page/about.ejs', { title: 'About this app'} );
        });
    }
}
