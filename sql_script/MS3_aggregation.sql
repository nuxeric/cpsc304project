/*(NESTED AGGREGATION) for each warehouse, find the youngest employee who works there -- NOT TO CONFIDENT ON THIS */
SELECT W.id, P.id, P.first_name, P.last_name
FROM warehouse W, personnel P, works_in N
WHERE W.id = N.warehouse_id 
    AND P.id = N.pid
    AND P.birth_date = (SELECT MAX(birth_date)
                        FROM personnel)
GROUP BY W.id
;

/*(NESTED AGGREGATION) for each warehouse, find the age of the youngest personnel who works there*/
SELECT W.id, P.id, P.first_name, P.last_name
FROM warehouse W, personnel P, works_in N
WHERE W.id = N.warehouse_id 
    AND P.id = N.pid
    AND P.birth_date = (SELECT MIN(birth_date)
                        FROM personnel)
GROUP BY W.id
;

/*(AGGREGATION - HAVING) provide the id of each warehouse that has more than "queried_num_employees"*/

SELECT id AS warehouse_id
FROM warehouse W, personnel P, works_in N
WHERE W.id = N.warehouse_id AND P.id = N.pid
GROUP BY warehouse_id
HAVING COUNT (*) > queried_num_employees;

/*(AGGREGATION - GROUP BY) for each warehouse, find the number of storage containers inside*/

SELECT W.id, COUNT(*)
FROM storage_container S, warehouse W
WHERE W.id = S.warehouse_id
GROUP BY W.id