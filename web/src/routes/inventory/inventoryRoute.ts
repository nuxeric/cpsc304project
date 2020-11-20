import ApiRoute from "../apiRoute";
import Database from "../../database";
import InventoryLogic from "../../model/inventoryLogic";
import Inventory from "../../model/inventory";

export default class InventoryRoute extends ApiRoute {
    private inventoryLogic: InventoryLogic;

    constructor(db: Database) {
        super(db);
        this.inventoryLogic = new InventoryLogic(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.inventoryRoute();
    }

    private inventoryRoute(): void {
        // Index
        this.router.get("/", (req, res) => {
            res.render('web/page/inventory/index.ejs', {title: "InventoryLogic"});
        });

        this.router.get("/hard-coded-select", (req, res) => {
            const inventoryListPromise: Promise<Inventory[]> = this.inventoryLogic.selectInventoryHardCode();
            inventoryListPromise
                .then(inventoryList => {
                    res.render('web/page/inventory/hard-coded-select.ejs',
                        {
                            title: "Inventory",
                            inventoryList: inventoryList
                        });
                })
                .catch(e => console.error(e.stack));
        });
    }

}
