import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";
import Accounts from "../../model/accounts";

export default class DividerRoute extends ApiRoute {
    private accounts;

    constructor(db: Database){
        super(db);
        this.accounts = new Accounts(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", (req, res) => {
            this.accounts.personnelWhoWorkInEveryWarehouse()
            .then(personnel => {
                res.render('web/page/divider/index.ejs', { title: "Division Query", personnel: personnel });
            })
            .catch(e => console.error(e.stack));
        });
    }
}
