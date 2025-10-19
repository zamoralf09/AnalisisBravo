-- Verificación de la Base de Datos Seguridad Bravo
USE seguridad_bravo;

-- 1. Verificar tablas creadas
SHOW TABLES;

-- 2. Verificar estructura de tablas principales
DESCRIBE users;
DESCRIBE roles;
DESCRIBE user_roles;
DESCRIBE login_attempts;

-- 3. Verificar datos iniciales
SELECT * FROM roles;
SELECT * FROM system_config;
SELECT * FROM security_policies;

-- 4. Verificar usuario administrador
SELECT 
    u.id, 
    u.username, 
    u.email, 
    u.estatus,
    r.nombre as rol
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

-- 5. Verificar procedimientos almacenados
SHOW PROCEDURE STATUS WHERE Db = 'seguridad_bravo';

-- 6. Verificar eventos programados
SHOW EVENTS;

-- 7. Verificar triggers
SHOW TRIGGERS;

-- 8. Verificar vistas
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- 9. Verificar conteo de registros
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM roles) as total_roles,
    (SELECT COUNT(*) FROM user_roles) as total_user_roles,
    (SELECT COUNT(*) FROM system_config) as total_config,
    (SELECT COUNT(*) FROM security_policies) as total_policies;