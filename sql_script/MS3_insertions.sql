/*Add new inventory types to the inventory_type table, 
	1) insert new_inventory_type dimensions into dimensions table if they do not already exist
		-> program must calculate volume based on h,w,l from input
	2) insert new type into inventory_type table 
		-> only if type does not already exists, otherwise, prompt warning. 
			-> We could add option to replace type's dimensions with new dimensions if we have extra time)*/

INSERT INTO dimensions (height, width, length, volume)
VALUES (new_height, new_width, new_length, new_volume)
ON CONFLICT (height, width, length) DO NOTHING;

INSERT INTO inventory_type(type_name, height, width, length)
VALUES (new_type_name, new_height, new_width, new_length);


/*Add a new recipient to the recipient table 
	1) insert new_recipient postal_code into region table if it does not already exist
		-> in this case, we would have to ask the user to provide municipality and province_or_territory
	2) insert new recipient
		-> only if recipient_id does not already exist in recipient table, otherwise, prompt warning. 
			-> We could add option to replace recipient based on duplicate id if we have extra time*/
INSERT INTO region
VALUES (new_postal_code, new_municipality, new_province_or_territory)
ON CONFLICT (postal_code) DO NOTHING;

INSERT INTO recipient(id, street_address, postal_code)
VALUES (new_id, new_street_address, new_postal_code);

/*Add a new producer to the producer table
	1) insert new_producer postal_code into region table if it does not already exist
		-> in this case, we would have to ask the user to provide municipality and province_or_territory
	2) insert new recipient
		-> only if producer_id does not already exist in producer table, otherwise, prompt warning. 
			-> We could add option to replace producer based on duplicate id if we have extra time*/

INSERT INTO region
VALUES (new_postal_code, new_municipality, new_province_or_territory)
ON CONFLICT (postal_code) DO NOTHING;

INSERT INTO producer (id, street_address, postal_code)
VALUES (new_id, new_street_address, new_postal_code);

/*Come up with values for a new container type, calculate its volume, insert that value into the dimensions table, then insert the container into container_type (has a FK to dimensions).
-> NOTE: warehouse referenced by new_warehouse_id must already exist. 
	If not, give user the option to add the new warehouse before putting a container in it
-> NOTE: occupied_volume is set to 0, as a new container will always be empty*/

INSERT INTO dimensions
VALUES (new_height, new_width, new_length, new_height * new_width * new_height)
ON CONFLICT (height, width, length) DO NOTHING;

INSERT INTO storage_container (id, warehouse_id, occupied_volume, height, width, length)
VALUES (new_id, new_warehouse_id, 0, new_height, new_width, new_length);

/*UPDATE OCCUPIED VOLUME OF WAREHOUSE IN WHICH NEW CONTAINER IS BEING PLACED (?)

INSERT INTO difference_cache (larger, smaller, difference)
VALUES (new_warehouse_id.available_volume, new_warehouse_id.occupied_volume+new_volume, difference);

UPDATE warehouse
SET occupied_volume = occupied_volume + new_volume
WHERE id = new_warehouse_id;*/

/*Insert inventory, assign it to a container, update the container’s occupied volume*/
INSERT INTO dimensions
VALUES (new_height, new_width, new_length, new_volume) /*program must calculate new_volume based on input*/
ON CONFLICT (height, width, length) DO NOTHING;

INSERT INTO inventory_type
VALUES (type_name, height, width, length)
ON CONFLICT (type_name) DO NOTHING;

		/*check if new_container_id already exists. If not, give user option to add container before adding inventory*/
INSERT INTO inventory (serial_num, container_id, type_name, weight, manufacture_date)
VALUES (new_serial_num, new_container_id, new_type_name, new_weight, new_date);

UPDATE storage_container 
SET occupied_volume = occupied_volume + (SELECT DISTINCT volume
										FROM dimensions D, inventory_type T
										WHERE T.type_name = new_type_name 
											AND D.height = T.height 
											AND D.length = T.length 
											AND D.width = T.width)
WHERE id = new_container_id;