-- Ver estado de la base de datos
SHOW STATUS LIKE 'Uptime';
SHOW PROCESSLIST;

-- Ver tamaño de la base de datos
SELECT 
    table_schema as 'Database',
    SUM(data_length + index_length) / 1024 / 1024 as 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'seguridad_bravo'
GROUP BY table_schema;

-- Ver tablas y su tamaño
SELECT 
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) as 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'seguridad_bravo'
ORDER BY (data_length + index_length) DESC;

-- Monitorear queries lentos
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';