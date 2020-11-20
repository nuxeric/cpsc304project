import ApiRoute from "../apiRoute";
import Database from "../../database";
import Storage from "../../model/storage";

export default class WarehouseRoute extends ApiRoute {
    private storage: Storage;

    constructor(db: Database) {
        super(db);
        this.storage = new Storage(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.warehouseRoute();
    }

    private warehouseRoute(): void {
        // Index
        this.router.get("/", (req, res) => {
            res.render('web/page/warehouse/index.ejs', {title: "Warehouses"});
        });

        this.router.get("/container-counts", (req, res) => {
            this.storage.warehouseContainerCounts()
            .then(result => {
                res.render('web/page/warehouse/container-counts.ejs',
                    {
                        title: "Aggregation with Group By Query",
                        result: result
                    });
            })
            .catch(e => console.error(e.stack));
        });
    }

}
