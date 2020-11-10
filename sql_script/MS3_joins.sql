/*Join storage_container and dimensions, to get total volume. Take this new result and
#join it again on difference_cache, matching total_volume, occupied_volume with larger,
#smaller, to get available volume.*/

SELECT DISTINCT diff_val as available_volume /*change "difference" to "diff_val"*/
FROM storage_container S, dimensions D, difference_cache C
WHERE S.height = D.height AND S.width = D.width AND S.length = D.length 
        AND D.volume = C.larger AND S.occupied_volume = C.smaller