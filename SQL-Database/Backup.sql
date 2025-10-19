-- Conectar a MySQL como administrador
mysql -u root -p

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS proyectoAnalisis;

-- Crear usuario manager con todos los privilegios
CREATE USER 'manager'@'localhost' IDENTIFIED BY 'manager';
GRANT ALL PRIVILEGES ON proyectoAnalisis.* TO 'manager'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'manager'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Usar la base de datos
USE proyectoAnalisis;