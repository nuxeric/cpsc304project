/*#UPDATES_________

#Update the street_address (new_street_address) and postal_code (new_postal_code) of a producer (updated_pid).*/

UPDATE producer
SET street_address = new_street_address
WHERE pid = updated_pid

UPDATE producer
SET postal_code = new_postal_code 
WHERE pid = updated_pid

	/*if postal_code does not already exist in region table -- THE USER SHOULD PROVIDE THESE VALUES, OTHERWISE THEY ARE NULL (?)*/

INSERT 
INTO region (postal_code, municipality, province_or_territory)
VALUES (new_postal_code,new_municipality, new_province_or_territory)

/*Update the last name (new_last_name) of a manager (updated_pid). --> name is in personnel table (do we want to force some restriction that only a manager can change its name?)*/

UPDATE personnel 
SET last_name = new_last_name
WHERE pid = updated_pid