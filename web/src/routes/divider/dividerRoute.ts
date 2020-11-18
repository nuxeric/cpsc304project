import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";
import Accounts from "../../model/accounts";
import { Console } from 'console';
import DividedPersonnel from '../../model/division/personnel_divided';
import PersonnelDivide from '../../model/division_personnel';

export default class DividerRoute extends ApiRoute {
    private personnel_division;

    constructor(db: Database){
        super(db);
        this.personnel_division = new PersonnelDivide(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
    
        this.router.get("/", (req, res) => {
            this.personnel_division.listDividedPersonnel()
            .then(div_result => {
                res.render('web/page/divider/divider.ejs', {title: "Divided Personnel", div_result: div_result});
            })
            .catch(e => console.error(e.stack));
        });
    }
}