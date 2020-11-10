/*Deletions__________________________*/

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

	#all three of these tables cascade on delete
	#we do not have a relationship such as line_worker is_managed_by personnel_manager 

/*To delete a Warehouse (del_warehouse_id): Delete all of its Inventory, all its Container(s), then the Warehouse*/

DELETE 
FROM inventory I
WHERE I.container_id = SELECT DISTINCT container_id
					 FROM storage_container C
					 WHERE C.warehouse_id = del_warehouse_id

DELETE
FROM storage_container C
WHERE C.warehouse_id = del_warehouse_id

DELETE 
FROM warehouse W
WHERE W.warehouse_id = del_warehouse_id