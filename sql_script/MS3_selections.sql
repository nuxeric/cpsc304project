/*SELECTIONS

#Select all managers who work for our organization*/

SELECT DISTINCT pid 				/*change to first_name, last_name?*/
FROM personnel P, personnel_manager M, inventory_manager I
WHERE P.pid = M.pid OR P.pid = I.pid;

/*Select all specific inventory items that have the pencil tag*/

SELECT serial_num
FROM catagorizes, inventory_type
WHERE T.tag = queried_tag;

/*Select all warehouses in specific province (queried_province)*/

SELECT id as warehouse_id
FROM warehouse W, region R
WHERE W.postal_code = R.postal_code AND province_or_territory = queried_province;

/*show the street address, municipality, province_or_territory, and pid of all producers*/

SELECT id, diff_val AS available_volume, municipality
FROM warehouse W, region R, difference_cache D
WHERE W.postal_code = R.postal_code 
        AND W.available_volume = D.larger
        AND W.occupied_volume = D.smaller
;