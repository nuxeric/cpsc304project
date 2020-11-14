import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";

export default class PersonnelRoute extends ApiRoute {
    constructor(db: Database) {
        super(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.personnelRoute();
    }

    private personnelRoute(): void {
        // Index
        this.router.get("/", (req, res) => {
            res.render('backend/page/personnel/index.ejs', { title: "Personnel" });
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
            res.render('backend/page/personnel/show.ejs', { title: "Showing Personnel" });
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
