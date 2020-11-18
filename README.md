# CPSC 304 Project

## Running the server

This will start the database and the backend server.

```bash
# To start
docker-compose up -d

# To close
docker-compose down
```

Anytime you make changes to the code, you will need to rebuild the backend's Docker image:

```bash
docker-compose build
docker-compose up -d
```

## Manually running the server

Docker Compose will do this for you. No need to run this manually. Although doing `npm install` will help your code editor understand the code and give you tips, so that's still a good idea to do!

```bash
cd web
npm install
npm run build
npm start
```

## Connecting to the database with `psql`

The debug credentials are postgres/postgres.

```bash
psql -h localhost -p 5432 -U postgres
```

Connect to the project's database:

```txt
postgres=# \l
                                  List of databases
    Name     |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
-------------+----------+----------+------------+------------+-----------------------
 cpsc304_dev | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
...

postgres=# \c cpsc304_dev
psql (12.4 (Ubuntu 12.4-0ubuntu0.20.04.1), server 12.2 (Debian 12.2-2.pgdg100+1))
You are now connected to database "cpsc304_dev" as user "postgres".

cpsc304_dev=#
```

To load the starter data, run the `initialize_db.sql` script:

```txt
cpsc304_dev=# \i ./sql_script/initialize_db.sql
```
