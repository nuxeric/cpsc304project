/*Update the street_address (new_street_address) and postal_code (new_postal_code) of a producer (updated_pid).*/

UPDATE producer
SET street_address = new_street_address /*value taken in from text field = new_street_address*/
WHERE id = updated_pid; /*value taken in from text field = updated_pid*/

UPDATE producer
SET postal_code = new_postal_code  /*value taken in from text field = new_postal_code*/
WHERE pid = updated_pid; /*value taken in from text field = updated_pid*/

/*Update the last name (new_last_name) of a manager (updated_pid). --> name is in personnel table (do we want to force some restriction that only a manager can change its name?)*/

UPDATE personnel 
SET last_name = new_last_name
WHERE id = new_id;