/*INSERTIONS___
#Add new inventory types to the inventory_type table*/
INSERT
INTO inventory_type(type_name, height, width, length)
VALUES (new_type_name, new_height, new_width, new_length);#impact on dimensions table?

/*Add a new recipient to the recipient table*/
INSERT
INTO recipient(id, street_address, postal_code)
VALUES (new_id, new_street_address, new_postal_code);

/*Add a new producer to the producer table*/
INSERT
INTO producer (id, street_address, postal_code)
VALUES (new_id, new_street_address, new_postal_code);

/*!!!!!!!!!!!!!!!Come up with values for a new container type, calculate its volume, insert that value into the dimensions table, then insert the container into container_type (has a FK to dimensions).
*/
INSERT
INTO storage_container (id, warehouse_id, occupied_volume, height, width, length)
VALUES (new_id, new_warehouse_id, 0, new_height, new_width, new_length);

	/*check if it exists in dimensions?*/
INSERT
INTO dimensions(height, width, length, volume)
VALUES (new_height, new_width, new_length, (new_height*new_width*new_length));

/* !!!!!!!!!!!!!!!!!!! Insert inventory, assign it to a container, update the container’s occupied volume, then update the warehouse’s total volume (??)
*/
INSERT
INTO inventory (serial_num, container_id, type_name, weight, manufacture_date)
VALUES (new_serial_num, new_container_id, new_type_name, new_weight, new_date);

		/*update containers occupied volume*/

UPDATE storage_container 
SET occupied_volume = occupied_volume + SELECT DISTINCT volume
										FROM dimensions D, inventory_type T
										WHERE T.typename = newTypeName AND D.height = T.height AND D.length = T.length AND D.width = T.width
WHERE container_id = newCid;

