/*Divide Producer table by region (with selection of postal_code in British Columbia) to get
#producers with all of their production facilities in British Columbia*/

/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

SELECT DISTINCT prod_id
FROM producers P, region R
WHERE NOT EXISTS
            ((SELECT DISTINCT postal_code
            from region R)
            EXCEPT
            (SELECT DISTINCT postal_code
            FROM region R
            WHERE province_or_territory = "British Columbia"))
    AND P.postal_code = R.postal_code;

/*Find all the employees who have worked in all warehouses:
Numerator: works_in, which is a table with Personnel IDs + Warehouse IDs they’ve
worked at (2 columns)
Denominator: Warehouse IDs (1 column)
Result: Personnel IDs which are associated with every Warehouse*/

SELECT DISTINCT pid
FROM personnel P
WHERE NOT EXISTS
            ((SELECT DISTINCT W.warehouse_id
              FROM warehouse W)
              EXCEPT
              (SELECT DISTINCT N.warehouse_id
              FROM works_in N
              WHERE N.pid = P.pid));