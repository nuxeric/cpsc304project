/*Remove an employee (del_id) from the personnel table, along with the inventory_manager, personnel_manager, or line_worker tables, as applicable.*/

DELETE
FROM inventory_manager
WHERE id = del_id;

DELETE
FROM personnel_manager
WHERE id = del_id;

DELETE
FROM line_worker
WHERE id = del_id;

/*To delete a Warehouse (del_warehouse_id): Delete all of its Inventory, all its Container(s), then the Warehouse
NOTE: warehouse to be deleted represented by id = "del_id"*/

DELETE 
FROM inventory I
WHERE I.container_id IN (SELECT DISTINCT C.id
					 FROM storage_container C
					 WHERE C.warehouse_id = del_id);
   
DELETE
FROM storage_container
WHERE warehouse_id = del_id;

DELETE 
FROM warehouse 
WHERE id = del_id;