/*Add new inventory types to the inventory_type table 
-> NOTE: only allows insertion when dimensions already exist in dimensions table*/
INSERT INTO inventory_type(type_name, height, width, length)
VALUES (new_type_name, new_height,new_width,new_length);

/*Add a new recipient to the recipient table 
-> NOTE: only allows insertion if postal code already exists in region*/
INSERT INTO recipient(id, street_address, postal_code)
VALUES (new_id, new_street_address, new_postal_code);

/*Add a new producer to the producer table
-> NOTE: only works when new_postal_code already exists in region table*/
INSERT
INTO producer (id, street_address, postal_code)
VALUES (new_id, new_street_address, new_postal_code);

/*Come up with values for a new container type, calculate its volume, insert that value into the dimensions table, then insert the container into container_type (has a FK to dimensions).
-> NOTE: only works if height, width, length tuple already exists in dimension table*/

INSERT
INTO storage_container (id, warehouse_id, occupied_volume, height, width, length)
VALUES (new_id, new_warehouse_id, new_occupied_volume, new_height, new_width, new_length);

/*Insert inventory, assign it to a container, update the container’s occupied volume, then update the warehouse’s total volume (??)
-> NOTE: only works if new_type_name already exists in type_name table*/
INSERT
INTO inventory (serial_num, container_id, type_name, weight, manufacture_date)
VALUES (new_serial_num, new_container_id, new_type_name, new_weight, new_date);

UPDATE storage_container 
SET occupied_volume = occupied_volume + (SELECT DISTINCT volume
										FROM dimensions D, inventory_type T
										WHERE T.type_name = new_type_name 
											AND D.height = T.height 
											AND D.length = T.length 
											AND D.width = T.width)
WHERE id = new_container_id;

/*insert new postal_code into region table*/
INSERT 
INTO region (postal_code, municipality, province_or_territory)
VALUES (new_postal_code, new_municipality, new_province_or_territory);