import path from 'path';
import ApiRoute from "../apiRoute";
import Database from "../../database";
import Accounts from "../../model/accounts";
import Personnel from "../../model/accounts/personnel";
import Permissions from "../../model/accounts/permissions";
import { Console } from 'console';

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
                res.render('web/page/personnel/index.ejs', { title: "Personnel", personnel: personnel });
            })
            .catch(e => console.error(e.stack));
        });

        // New
        this.router.get("/new", (req, res) => {
            res.render('web/page/personnel/new.ejs', { title: "New Personnel" });
        });

        // Create
        this.router.post("/", (req, res) => {
            let firstName = undefined;
            let lastName = undefined;
            let birthDate = undefined;
            let lineWorker = undefined;
            let inventoryManager = undefined;
            let personnelManager = undefined;
            let responsibilities = undefined;
            let employeesManaged = undefined;

            ({ firstName, lastName, birthDate, lineWorker, inventoryManager,
                personnelManager, responsibilities, employeesManaged }
                = req.body);

            this.accounts.createPersonnel(
                undefined,
                firstName,
                lastName,
                new Permissions(
                    lineWorker = lineWorker,
                    inventoryManager = inventoryManager,
                    personnelManager = personnelManager
                ),
                new Date(birthDate),
                responsibilities,
                employeesManaged
            )
            .then(id => { // TODO (nice to have): put success/error flash message
                this.accounts.getPersonnel(id)
                .then(personnel => {
                    res.redirect(`/personnel/${personnel.id}`);
                })
                .catch(error => {
                    res.redirect('/personnel/new');
                })
            });
        });

        // Show
        this.router.get("/:id", (req, res) => {
            const id: number = parseInt(req.params.id);

            this.accounts.getPersonnel(id)
            .then(personnel => {
                res.render('web/page/personnel/show.ejs', {
                    title: `Personnel #${id}`,
                    personnel: personnel,
                });
            }) // Didn't find Personnel
            .catch(e => res.render('web/page/personnel/show.ejs', {
                title: e,
                personnel: null,
            }));
        });

        // Edit
        this.router.get("/:id/edit", (req, res) => {
            const id: number = parseInt(req.params.id);

            this.accounts.getPersonnel(id)
            .then(personnel => {
                res.render('web/page/personnel/edit.ejs', {
                    title: `Edit Personnel #${id}`,
                    personnel: personnel,
                });
            }) // Didn't find Personnel
            .catch(e => res.render('web/page/personnel/edit.ejs', {
                title: e,
                personnel: null,
            }));
        });

        // Update
        this.router.post("/:id", (req, res) => {
            if (req.body._method == "put" || req.body._method == "patch") {
                this.handlePersonnelUpdate(req, res);
            } else if (req.body._method == "delete") {
                this.handlePersonnelDelete(req, res);
            } else {
                res.status(400).send("That's not a valid request.");
            }
        });

        this.router.patch("/:id", (req, res) => {
            this.handlePersonnelUpdate(req, res);
        });

        // Duplicate of patch("/:id")
        this.router.put("/:id", (req, res) => {
            this.handlePersonnelUpdate(req, res);
        });

        // Delete
        this.router.delete("/:id", (req, res) => {
            this.handlePersonnelDelete(req, res);
        });
    }

    private handlePersonnelUpdate(req: any, res: any) {
        const id: number = parseInt(req.params.id);
        let firstName = undefined;
        let lastName = undefined;
        let birthDate = undefined;
        let lineWorker = undefined;
        let inventoryManager = undefined;
        let personnelManager = undefined;
        let responsibilities = undefined;
        let employeesManaged = undefined;

        ({ firstName, lastName, birthDate, lineWorker, inventoryManager,
            personnelManager, responsibilities, employeesManaged }
            = req.body);

        // Leaving the field empty sends the arg as an empty string
        employeesManaged = (employeesManaged == '') ? undefined : employeesManaged;

        this.accounts.updatePersonnel(
            id,
            firstName,
            lastName,
            new Permissions(
                lineWorker = lineWorker,
                inventoryManager = inventoryManager,
                personnelManager = personnelManager
            ),
            new Date(Personnel.birthDateString(birthDate)),
            responsibilities,
            employeesManaged
        )
        .then(returnedID => { // TODO (nice to have): put success/error flash message
            this.accounts.getPersonnel(id)
            .then(personnel => {
                res.redirect(`/personnel/${id}`);
            })
            .catch(error => {
                res.redirect('/personnel/new');
            })
        });
    }

    private handlePersonnelDelete(req: any, res: any) {
        const id: number = parseInt(req.params.id);

        this.accounts.deletePersonnel(id)
        .then(personnel => {
            res.redirect(`/personnel`);
        })
        .catch(error => {
            res.redirect('/personnel');
        })
    }
}
