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