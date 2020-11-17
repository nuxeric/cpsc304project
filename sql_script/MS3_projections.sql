/*find the street_address of all recipients*/

SELECT street_address
FROM recipient;

/*find the first names of all line_workers*/

SELECT first_name
FROM line_worker L, personnel P
WHERE L.id = P.id;

/*display all personnel working in a given warehouse*/

SELECT W.warehouse_id, P.id, first_name, last_name
FROM personnel P, works_in W
WHERE P.id = W.pid
    AND W.warehouse_id = queried_warehouse;