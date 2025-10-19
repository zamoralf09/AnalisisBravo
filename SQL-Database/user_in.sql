-- Crear usuario específico para la aplicación (opcional pero recomendado)
CREATE USER 'bravo_user'@'localhost' IDENTIFIED BY 'BravoSecure123!';
GRANT ALL PRIVILEGES ON *.* TO 'bravo_user'@'localhost';
FLUSH PRIVILEGES;


