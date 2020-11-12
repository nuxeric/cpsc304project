CREATE TABLE personnel (
    id INTEGER,
    birth_date DATE,
    first_name TEXT,
    last_name TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE line_worker (
    id INTEGER,
    responsibilities TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (id)
    REFERENCES personnel (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE inventory_manager (
    id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (id)
    REFERENCES personnel (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE personnel_manager (
    id INTEGER,
    number_of_employees_managed INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (id)
    REFERENCES Personnel (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE dimensions (
    height DOUBLE PRECISION,
    width DOUBLE PRECISION,
    length DOUBLE PRECISION,
    volume DOUBLE PRECISION,
    PRIMARY KEY (height, width, length)
);

CREATE TABLE region(
    postal_code CHAR(6),
    municipality TEXT,
    province_or_territory TEXT,
    PRIMARY KEY (postal_code)
);

CREATE TABLE difference_cache(
    larger INTEGER,
    smaller INTEGER,
    difference INTEGER NOT NULL,
    PRIMARY KEY (larger, smaller)
);

CREATE TABLE warehouse (
    id INTEGER,
    total_volume DOUBLE PRECISION,
    occupied_volume DOUBLE PRECISION,
    street_address TEXT,
    postal_code CHAR(6),
    PRIMARY KEY (id),
    FOREIGN KEY (postal_code)
        REFERENCES region(postal_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (total_volume, occupied_volume)
        REFERENCES difference_cache (larger, smaller)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE storage_container (
    id INTEGER,
    warehouse_id INTEGER NOT NULL,
    occupied_volume DOUBLE PRECISION,
    height DOUBLE PRECISION,
    width DOUBLE PRECISION,
    length DOUBLE PRECISION,
    PRIMARY KEY (id),
    FOREIGN KEY (warehouse_id)
        REFERENCES warehouse (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (height, width, length)
        REFERENCES dimensions (height, width, length)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
);

CREATE TABLE producer (
    id INTEGER,
    street_address TEXT,
    postal_code CHAR(6),
    PRIMARY KEY (id),
    FOREIGN KEY (postal_code)
        REFERENCES region (postal_code)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE inventory_type (
    type_name TEXT,
    height DOUBLE PRECISION,
    width DOUBLE PRECISION,
    length DOUBLE PRECISION,
    PRIMARY KEY (type_name),
    FOREIGN KEY (height, width, length)
        REFERENCES Dimensions (height, width, length)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE inventory (
    serial_num INTEGER,
    container_id INTEGER NOT NULL,
    type_name TEXT NOT NULL,
    weight INTEGER,
    manufacture_date DATE,
    PRIMARY KEY (serial_num),
    FOREIGN KEY (container_id)
        REFERENCES storage_container (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (type_name)
        REFERENCES inventory_type (type_name)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE tag (
    name TEXT,
    PRIMARY KEY (name)
);

CREATE TABLE categorizes (
    tag_name TEXT,
    inventory_type_name TEXT,
    PRIMARY KEY (tag_name, inventory_type_name),
    FOREIGN KEY (tag_name)
        REFERENCES tag (name)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (inventory_type_name)
        REFERENCES inventory_type (type_name)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE delivery (
    id INTEGER,
    date DATE,
    PRIMARY KEY (id)
);

CREATE TABLE delivers_inventory(
    serial_num INTEGER,
    delivery_id INTEGER,
    PRIMARY KEY (serial_num, delivery_id),
    FOREIGN KEY (serial_num)
        REFERENCES inventory(serial_num)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (delivery_id)
        REFERENCES delivery (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE production_facility (
    id INTEGER,
    producer_id INTEGER NOT NULL,
    postal_code CHAR (6),
    street_address TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (postal_code)
        REFERENCES region (postal_code)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (producer_id)
        REFERENCES producer (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE incident (
    id INTEGER,
    producer_id INTEGER NOT NULL,
    date DATE,
    description TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (producer_id)
        REFERENCES producer (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE recipient (
    id INTEGER,
    street_address TEXT,
    postal_code CHAR(6),
    PRIMARY KEY (id),
    FOREIGN KEY (postal_code)
        REFERENCES region (postal_code)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE dispatches (
    delivery_id INTEGER,
    recipient_id INTEGER,
    warehouse_id INTEGER,
    PRIMARY KEY (delivery_id, recipient_id, warehouse_id),
    FOREIGN KEY (delivery_id)
        REFERENCES delivery (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (recipient_id)
        REFERENCES recipient (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (warehouse_id)
        REFERENCES warehouse (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE receives (
    delivery_id INTEGER,
    producer_id INTEGER,
    warehouse_id INTEGER,
    PRIMARY KEY (delivery_id, producer_id, warehouse_id),
    FOREIGN KEY (delivery_id)
        REFERENCES delivery (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (producer_id)
        REFERENCES recipient (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (warehouse_id)
        REFERENCES warehouse (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE works_in (
    pid INTEGER,
    warehouse_id INTEGER,
    PRIMARY KEY (pid, warehouse_id),
    FOREIGN KEY (pid)
        REFERENCES personnel (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (warehouse_id)
        REFERENCES warehouse (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*INSERT INITIAL DATA*/
/*PERSONNEL*/

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (1, 1999-01-05, 'Eric', 'Son')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (2, 1942-02-12, 'John', 'Smith')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (3, 1985-06-09, 'Tom', 'Hanks')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (4, 1988-02-01, 'Kim', 'Possible')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (5, 1990-12-12, 'Sarah', 'Lee')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (6, 1993-06-29, 'Martin', 'Short')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (7, 1981-09-26, 'Serena', 'Williams')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (8, 1978-12-30, 'David', 'Peterson')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (9, 1995-02-18, 'Bert', 'Sesame')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (10, 1999-08-11, 'Shaun', 'Donnelly')

INSERT
INTO personnel (id, birth_date, first_name, last_name)
VALUES (11, 2000-04-14, 'Peyton', 'Seigo')

/*LINE WORKER*/
INSERT
INTO line_worker (id, responsibilities)
VALUES (1, 'Mop and sweep the floors')

INSERT
INTO line_worker (id, responsibilities)
VALUES (2, 'Clean the machines')

INSERT
INTO line_worker (id, responsibilities)
VALUES (5, 'Fill hand sanitizers')

INSERT
INTO line_worker (id, responsibilities)
VALUES (9, 'Clean inventory boxes')

INSERT
INTO line_worker (id, responsibilities)
VALUES (10, 'Move inventory boxes')

/*INVENTORY MANAGER*/
INSERT
INTO inventory_manager (id)
VALUES (3)

INSERT
INTO inventory_manager (id)
VALUES (4)

INSERT
INTO inventory_manager (id)
VALUES (7)

INSERT
INTO inventory_manager (id)
VALUES (8)

INSERT
INTO inventory_manager (id)
VALUES (11)

/*PERSONNEL_MANAGER*/
INSERT
INTO personnel_manager (id, number_of_employees_managed)
VALUES (1, 8)

INSERT
INTO personnel_manager  (id, number_of_employees_managed)
VALUES (2, 2)

INSERT
INTO personnel_manager  (id, number_of_employees_managed)
VALUES (5, 10)

INSERT
INTO personnel_manager  (id, number_of_employees_managed)
VALUES (6, 20)

INSERT
INTO personnel_manager  (id, number_of_employees_managed)
VALUES (10, 50)

/*DIMENSIONS*/
INSERT
INTO dimensions (height, width, length, volume)
VALUES (1, 10, 10, 100)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (0.02, 0.02, 0.02, 0.000008)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (0.5, 26, 39, 507)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (0.5, 0.5, 17, 4.25)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (12, 6, 6, 432)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (15, 20, 30, 9000)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (0.7, 0.7, 10, 4.9)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (10, 10, 10, 1000)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (10, 10, 5, 500)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (12, 5, 20, 1500)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (30, 30, 30, 27000)

INSERT
INTO dimensions (height, width, length, volume)
VALUES (20, 20, 10, 4000)

/*DIFFERENCE CACHE*/

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (100000, 0, 100000)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (500694, 10000, 490,694)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (12839, 5000, 7839)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (20000,  10203, 9797)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (123456, 123456, 0)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (100, 0, 100)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (500, 250, 250)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (1500, 500, 1000)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (2000, 900, 1100)

INSERT
INTO difference_cache (larger, smaller, diff_val)
VALUES (4000, 50, 3950)

/*INVENTORY_TYPE*/
INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('Fidget Spinner', 1, 10, 10)

INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('Intel Core i7-6700 0.02 Processor', 0.02, 0.02, 0.02)

INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('B/W striped notebook', 0.5, 26, 39)

INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('HB Graphite Pencil', 0.5, 0.5, 17)

INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('Coca Cola Pop', 12, 6, 6)

INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('TY Bat Mobile Stuffy', 15, 20, 30)

INSERT
INTO inventory_type (type_name, height, width, length)
VALUES ('Dixon Ticonderoga Pencil', 0.7, 0.7, 10)