/*Find all the employees who work in all warehouses*/

SELECT DISTINCT id
FROM personnel P
WHERE NOT EXISTS
            ((SELECT DISTINCT W.id
              FROM warehouse W)
              EXCEPT
              (SELECT DISTINCT N.warehouse_id
              FROM works_in N
              WHERE N.pid = P.id));