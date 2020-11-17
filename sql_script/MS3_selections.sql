/*Select all managers who work for our organization*/

SELECT DISTINCT P.id 				
FROM personnel P, personnel_manager M, inventory_manager I
WHERE P.id = M.id OR P.id = I.id;

/*Select all specific inventory items that have the pencil tag*/

SELECT type_name
FROM categorizes C, inventory_type T
WHERE C.tag_name = queried_tag; /*input from text field = "queried_tag"*/

/*Select all warehouses in specific province (queried_province)*/

SELECT id as warehouse_id
FROM warehouse W, region R
WHERE W.postal_code = R.postal_code AND R.province_or_territory = queried_province; /*queried_province -> province selected from drop down box?*/

/*show the id, available volume, and municipality of all warehouses in a given province*/

SELECT id, difference AS available_volume, municipality
FROM warehouse W, region R, difference_cache D
WHERE W.postal_code = R.postal_code 
        AND W.total_volume = D.larger
        AND W.occupied_volume = D.smaller
        AND R.province_or_territory = queried_province; /*queried_province -> province from dropdown menu?*/