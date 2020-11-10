/*find the street_address of all recipients*/

SELECT street_address
FROM recipients;

/*find the first names of all line_workers*/

SELECT first_name
FROM line_worker L, personnel P
WHERE L.pid = P.pid;