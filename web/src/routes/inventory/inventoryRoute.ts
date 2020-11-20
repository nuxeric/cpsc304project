import ApiRoute from "../apiRoute";
import Database from "../../database";
import Storage from "../../model/storage";

export default class InventoryRoute extends ApiRoute {
    private storage: Storage;

    constructor(db: Database) {
        super(db);
        this.storage = new Storage(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.inventoryRoute();
    }

    private inventoryRoute(): void {
        // Index
        this.router.get("/", (req, res) => {
            res.render('web/page/inventory/index.ejs', {title: "Inventory"});
        });

        this.router.get("/projection", (req, res) => {
            this.storage.selectInventoryAndProject()
            .then(inventoryList => {
                res.render('web/page/inventory/projection.ejs',
                    {
                        title: "Projection Query",
                        inventoryList: inventoryList
                    });
            })
            .catch(e => console.error(e.stack));
        });

        this.router.get("/nested-aggregation-with-group-by", (req, res) => {
            this.storage.inventoryTypesWithSmallerThanAverageVolume()
            .then(inventoryTypes => {
                res.render('web/page/inventory/nested-aggregation-with-group-by.ejs',
                    {
                        title: "Nested Aggregation with Group By Query",
                        inventoryTypes: inventoryTypes
                    });
            })
            .catch(e => console.error(e.stack));
        });
    }

}
