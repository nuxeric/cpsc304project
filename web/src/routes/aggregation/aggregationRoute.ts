import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";
import Storage from "../../model/storage";
import logger from "../../config/logger";

export default class AggregationRoute extends ApiRoute {
    private storage: Storage;

    constructor(db: Database) {
        super(db);
        this.storage = new Storage(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.warehouseRoute();
    }

    private warehouseRoute(): void{
        //Index
        this.router.get("/index", (req, res) => {
            res.render("web/page/aggregation/index.ejs", {title: "Aggregation on Warehouses"})
        });

        //Result of HAVING query
        this.router.post("/agg_having", (req, res) => {
            let minimum_personnel_num = undefined;
            ({minimum_personnel_num} = req.body);
            if (minimum_personnel_num == undefined) {
                res.status(400).send();
            }
            this.storage.aggregationHavingOnWarehouse(minimum_personnel_num)
            .then(warehouse => {
                res.render('web/page/aggregation/agg_having.ejs', { title: "Aggregation with Having Query", warehouse: warehouse });
            })
            .catch(e => console.error(e.stack));
        });
    }
}