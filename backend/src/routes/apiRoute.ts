import Database from "../database";
import express, { Router } from "express";


export default class ApiRoute {
    protected db: Database;
    public router: Router;

    constructor(db: Database) {
        this.db = db;
        this.router = express.Router();
    }

}