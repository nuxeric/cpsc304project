import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";
import Accounts from "../../model/accounts";

export default class PersonnelRoute extends ApiRoute {
    private accounts;

    constructor(db: Database) {
        super(db);
        this.accounts = new Accounts(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.personnelRoute();
    }

    private personnelRoute(): void {
        // Index
        this.router.get("/", (req, res) => {
            this.accounts.listPersonnel()
                .then(personnel => {
                    res.render('backend/page/personnel/index.ejs', { title: "Personnel", personnel: personnel });
                })
                .catch(e => console.error(e.stack));
        });

        // New
        this.router.get("/new", (req, res) => {
            res.render('backend/page/personnel/new.ejs', { title: "New Personnel" });
        });

        // Create
        this.router.post("/", (req, res) => {
            // ???
            res.render('backend/page/personnel/index.ejs', { title: "TODO" });
        });

        // Show
        this.router.get("/:id", (req, res) => {
            const id: number = parseInt(req.params.id);

            this.accounts.getPersonnel(id)
                .then(personnel => {
                    res.render('backend/page/personnel/show.ejs', {
                        title: `Personnel #${id}`,
                        personnel: personnel,
                    });
                }) // Didn't find Personnel
                .catch(e => res.render('backend/page/personnel/show.ejs', {
                    title: e,
                    personnel: null,
                }));
        });

        // Edit
        this.router.get("/:id/edit", (req, res) => {
            res.render('backend/page/personnel/edit.ejs', { title: "Edit Personnel", user: req.params });
        });

        // Update
        this.router.patch("/:id", (req, res) => {
            // ???
            res.render('backend/page/personnel/index.ejs', { title: "TODO" });
        });

        this.router.put("/:id", (req, res) => {
            // ???
            res.render('backend/page/personnel/index.ejs', { title: "TODO" });
        });

        // Delete
        this.router.delete("/:id", (req, res) => {
            // ???
            // res.render('backend/page/personnel/index.ejs', { title: "" });
        });

        this.router.post("/test-route", (req, res) => {
          const args = res.json(req.body);
          res.send(args);
            // res.send("Created: " + req.params.first_name + " " + req.params.last_name);
        });
    }
}
