DROP TABLE personnel CASCADE;
DROP TABLE line_worker CASCADE;
DROP TABLE inventory_manager CASCADE;
DROP TABLE personnel_manager CASCADE;
DROP TABLE dimensions CASCADE;
DROP TABLE region CASCADE;
DROP TABLE difference_cache CASCADE;
DROP TABLE warehouse CASCADE;
DROP TABLE storage_container CASCADE;
DROP TABLE producer CASCADE;
DROP TABLE inventory_type CASCADE;
DROP TABLE inventory CASCADE;
DROP TABLE tag CASCADE;
DROP TABLE categorizes CASCADE;
DROP TABLE delivery CASCADE;
DROP TABLE delivers_inventory CASCADE;
DROP TABLE production_facility CASCADE;
DROP TABLE incident CASCADE;
DROP TABLE recipient CASCADE;
DROP TABLE dispatches CASCADE;
DROP TABLE receives CASCADE;
DROP TABLE works_in CASCADE;

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
    larger DOUBLE PRECISION,
    smaller DOUBLE PRECISION,
    difference DOUBLE PRECISION NOT NULL, 
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
        ON UPDATE RESTRICT
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
INSERT INTO personnel (id, birth_date, first_name, last_name)
VALUES (1, '1999-01-05', 'Eric', 'Son'),
	(2, '1942-02-12', 'John', 'Smith'),
    (3, '1985-06-09', 'Tom', 'Hanks'),
    (4, '1988-02-01', 'Kim', 'Possible'),
    (5, '1990-12-12', 'Sarah', 'Lee'),
    (6, '1993-06-29', 'Martin', 'Short'),
    (7, '1981-09-26', 'Serena', 'Williams'),
    (8, '1978-12-30', 'David', 'Peterson'),
    (9, '1995-02-18', 'Bert', 'Sesame'),
    (10, '1999-08-11', 'Shaun', 'Donnelly'),
    (11, '2000-04-14', 'Peyton', 'Seigo');
    
INSERT INTO line_worker (id, responsibilities)
VALUES (1, 'Mop and sweep the floors'),
    (2, 'Clean the machines'),
    (5, 'Fill hand sanitizers'),
    (9, 'Clean inventory boxes'),
    (10, 'Move inventory boxes');
    
INSERT INTO inventory_manager (id)
VALUES (3),(4),(7),(8),(11);

INSERT INTO personnel_manager (id, number_of_employees_managed)
VALUES (1, 8),
    (2, 2),
    (5, 10),
    (6, 20),
    (10, 50);

INSERT INTO dimensions (height, width, length, volume)
VALUES (1, 10, 10, 100),
    (0.02, 0.02, 0.02, 0.000008),
    (0.5, 26, 39, 507),
    (0.5, 0.5, 17, 4.25),
    (12, 6, 6, 432),
    (15, 20, 30, 9000),
    (0.7, 0.7, 10, 4.9),
    (10, 10, 10, 1000),
    (10, 10, 5, 500),
    (12, 5, 20, 1200),
    (30, 30, 30, 27000),
	(20, 20, 10, 4000),
    (15, 5, 20, 1500);
    
INSERT INTO region (postal_code, municipality, province_or_territory)
VALUES ('V9K2L7', 'Qualicum Beach', 'British Columbia'),
    ('V2S3M2', 'Abbotsford', 'British Columbia'),
    ('L0S1J0', 'Niagara-on-the-Lake', 'Ontario'),
    ('T0J2P0', 'Medicine Hat', 'Alberta'),
    ('X0A0H0', 'Iqaluit', 'Nunavut'),
    ('V6T1L4', 'Vancouver', 'British Columbia'),
    ('AOK4R0', 'Tilt Cove', 'Newfoundland'),
    ('A0B1N0', 'Goobies', 'Newfoundland'),
    ('V0R3E1', 'Youbou', 'British Columbia'),
    ('V9M4N4', 'Victoria', 'British Columbia'),
    ('L9B8K3', 'Peterborough','Ontario'),
    ('V9N4K0', 'Aurora', 'Ontario'),
    ('B9K4H2', 'Kelowna', 'British Columbia'),
    ('K9S4J2', 'Richmond Hill', 'Ontario');

INSERT INTO difference_cache (larger, smaller, difference)
VALUES (100000, 0, 100000),
    (500694, 10000, 490694),
    (12839, 5000, 7839),
    (20000,  10203, 9797),
    (123456, 123456, 0),
    (100, 0, 100),
    (500, 250, 250),
    (1500, 500, 1000),
    (2000, 900, 1100),
    (4000, 50, 3950),
    (10000, 0,10000),
    (100000, 204.250008,99795.749992),
    (150000, 9000, 141000),
    (40000, 507, 39493),
    (20000, 0, 20000);

INSERT INTO warehouse(id, total_volume, occupied_volume, street_address, postal_code)
VALUES (1, 100000, 204.250008, '123 Something St', 'V9K2L7'),
    (2, 10000, 0, '493 NeverLand Av', 'V2S3M2'),
    (3, 150000, 9000, '4020 Warehouse Cr', 'L0S1J0'),
    (4, 40000, 507, '9999 Cool St', 'T0J2P0'),
    (5, 20000, 0, '1411 Cool St', 'X0A0H0');
    
INSERT INTO storage_container(id, warehouse_id, occupied_volume, height, width, length)
VALUES(1, 1, 200, 10, 10, 10),
	(2, 1, 0.000008, 10, 10, 5),
    (3, 1, 4.25, 15, 5, 20),
    (4, 3, 9000, 30, 30, 30),
    (5, 4, 507, 20, 20, 10);
    
INSERT INTO producer(id, street_address, postal_code)
VALUES (12, '52 Wesbrook Mall', 'V6T1L4'),
	(1, '4 Lower Mall', 'V6T1L4'),
    (2, '452 Willow Ave.', 'V2S3M2'),
    (3, '15 Somebody St.', 'L0S1J0'),
    (4, '9 Who St.', 'L0S1J0'),
    (5, '34 Lake Rd.', 'V6T1L4'),
	(32, '42 Life Av.', 'V2S3M2'),
    (55, '12 Nobody St.', 'AOK4R0'),
    (11, '3 What Rd.', 'A0B1N0'),
    (23, '45 Ocean Av.', 'V0R3E1');

INSERT INTO inventory_type (type_name, height, width, length)
VALUES ('Fidget Spinner', 1, 10, 10),
    ('Intel Core i7-6700 0.02 Processor', 0.02, 0.02, 0.02),
    ('B/W striped notebook', 0.5, 26, 39),
    ('HB Graphite Pencil', 0.5, 0.5, 17),
    ('Coca Cola Pop', 12, 6, 6),
    ('TY Bat Mobile Stuffy', 15, 20, 30),
    ('Dixon Ticonderoga Pencil', 0.7, 0.7, 10);

INSERT INTO inventory (serial_num, container_id, type_name, weight, manufacture_date)
VALUES (1,1,'Fidget Spinner',2,'2017-06-20'),
    (2, 2,'Intel Core i7-6700 0.02 Processor', 15, '2017-10-07'),
    (3, 3,'HB Graphite Pencil', 5, '2017-12-25'),
    (4, 4,'TY Bat Mobile Stuffy', 1, '2017-01-04'),
    (5, 5, 'B/W striped notebook', 10, '2016-04-25'),
    (6, 5,'B/W striped notebook', 10, '2016-04-25');

INSERT INTO tag (name)
VALUES ('pencil'),
    ('toy'),
    ('soda'),
    ('notebook'),
    ('computer'),
    ('stationary');

INSERT INTO delivery(id, date)
VALUES (1, '2020-10-23'),
    (2, '2019-07-20'),
    (3, '2018-03-22'),
    (4, '2018-12-05'),
    (5, '2019-09-15'),
    (6, '2019-10-17'),
    (7, '2020-02-18'),
    (8, '2020-07-30'),
    (9, '2020-09-02'),
    (10, '2020-12-19');
       
INSERT INTO delivers_inventory
VALUES (1, 3),
    (2, 2),
    (3, 1),
    (4, 4),
    (5, 5),
    (6, 5);
        
INSERT INTO production_facility (id, producer_id, postal_code, street_address)
VALUES (1, 1, 'V9M4N4', '1 Fairy St'), 
    (2, 2, 'L9B8K3', '2 Crazy Ave'),
    (3, 3, 'V9N4K0', '3 Kingsway St'),
    (4, 4, 'B9K4H2', 'Holloway Cr'), 
    (5, 5, 'K9S4J2', 'Holloway Cr');
    
INSERT INTO incident (id, producer_id, date, description)
VALUES (1, 1, '2018-04-13', 'Produced products unethically'),
    (2, 1, '2019-01-24', 'Spilt coffee over products'),
    (3, 1, '2020-09-09', 'Workers went on strike due to poor wages'),
    (4, 2, '2019-12-23', 'Products were faulty'),
    (5, 2, '2020-10-23', 'Evidence of poor handling of products upon delivery');
    
INSERT INTO recipient (id, street_address, postal_code)
VALUES (1, '3 East Mall', 'V6T1L4'),
    (2, '56 Line 6 Rd.', 'L0S1J0'),
    (3, '887 Hat Rd.', 'T0J2P0'),
    (4, '12 Gilbert Av.', 'V2S3M2'),
    (5, '9 Who Rd.', 'V0R3E1');

INSERT INTO dispatches (delivery_id, recipient_id, warehouse_id)
VALUES (1, 1, 1),
	(2, 1, 2),
    (3, 1, 3),
    (4, 4, 4),
    (5, 5, 5);
    
INSERT INTO receives (delivery_id, producer_id, warehouse_id)
VALUES(6, 1, 1),
	(7, 2, 1),
    (8, 3, 2),
    (9, 4, 3),
    (10, 5, 4);

INSERT INTO works_in (pid, warehouse_id)
VALUES(1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
	(2, 1),
    (3, 1),
    (4, 3),
    (5, 5),
    (10, 1),
    (10, 2),
    (10, 3),
    (10, 4),
    (10, 5),
    (11, 1),
    (11, 2),
    (11, 3),
    (11, 4),
    (11, 5);