import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";
import Accounts from "../../model/accounts";
import { Console } from 'console';

export default class DividerRoute extends ApiRoute {
    //private producers;
    //private production_facilities;

    constructor(db: Database){
        super(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //this.
        this.router.get("/", (req, res) => {
            res.render('web/page/divider.ejs', {title: "Production Facilities"});
        });
    }
}