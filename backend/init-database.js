const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
    host: 'localhost',
    user: 'root', // Cambia por tu usuario de MySQL
    password: 'root', // Cambia por tu contraseña de MySQL
    database: 'ProyectoAnalisis'
};

async function initDatabase() {
    let connection;

    try {
        // Conectar a MySQL sin especificar base de datos
        connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        console.log('Conectado a MySQL server');

        // Crear base de datos si no existe
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`Base de datos '${dbConfig.database}' creada o ya existe`);

        // Usar la base de datos
        await connection.execute(`USE ${dbConfig.database}`);

        // Crear tablas según el script SQL
        const tablasSQL = [
            `CREATE TABLE EMPRESA (
                IdEmpresa int not null auto_increment,
                Nombre varchar(100) not null,
                Direccion varchar(200) not null,
                Nit varchar(20) not null,
                PasswordCantidadMayusculas int,
                PasswordCantidadMinusculas int,
                PasswordCantidadCaracteresEspeciales int,
                PasswordCantidadCaducidadDias int,
                PasswordLargo int,
                PasswordIntentosAntesDeBloquear int,
                PasswordCantidadNumeros int,
                PasswordCantidadPreguntasValidar int,
                FechaCreacion datetime not null,
                UsuarioCreacion varchar(100) not null,
                FechaModificacion datetime,
                UsuarioModificacion varchar(100),
                primary key (IdEmpresa)
            )`,

            `CREATE TABLE SUCURSAL (
                IdSucursal int not null auto_increment,
                Nombre varchar(100) not null,
                Direccion varchar(200) not null,
                IdEmpresa int not null,
                FechaCreacion datetime not null,
                UsuarioCreacion varchar(100) not null,
                FechaModificacion datetime,
                UsuarioModificacion varchar(100),
                primary key (IdSucursal),
                foreign key (IdEmpresa) references EMPRESA(IdEmpresa)
            )`,

            `CREATE TABLE STATUS_USUARIO (
                IdStatusUsuario int not null auto_increment,
                Nombre varchar(100) not null,
                FechaCreacion datetime not null,
                UsuarioCreacion varchar(100) not null,
                FechaModificacion datetime,
                UsuarioModificacion varchar(100),
                primary key (IdStatusUsuario)
            )`,

            `CREATE TABLE GENERO (
                IdGenero int not null auto_increment,
                Nombre varchar(100) not null,
                FechaCreacion datetime not null,
                UsuarioCreacion varchar(100) not null,
                FechaModificacion datetime,
                UsuarioModificacion varchar(100),
                primary key (IdGenero)
            )`,

            `CREATE TABLE ROLE (
                IdRole int not null auto_increment,
                Nombre varchar(50) not null,
                FechaCreacion datetime not null,
                UsuarioCreacion varchar(100) not null,
                FechaModificacion datetime,
                UsuarioModificacion varchar(100),
                primary key (IdRole)
            )`,

            `CREATE TABLE USUARIO (
                IdUsuario varchar(100) not null,
                Nombre varchar(100) not null,
                Apellido varchar(100) not null,
                FechaNacimiento date not null,
                IdStatusUsuario int not null,
                Password varchar(100) not null,
                IdGenero int not null,
                UltimaFechaIngreso datetime,
                IntentosDeAcceso int,
                SesionActual varchar(100),
                UltimaFechaCambioPassword datetime,
                CorreoElectronico varchar(100),
                RequiereCambiarPassword int,
                Fotografia mediumblob,
                TelefonoMovil varchar(30),
                IdSucursal int not null,
                Pregunta varchar(200) not null,
                Respuesta varchar(200) not null,
                IdRole int not null,
                FechaCreacion datetime not null,
                UsuarioCreacion varchar(100) not null,
                FechaModificacion datetime,
                UsuarioModificacion varchar(100),
                primary key (IdUsuario),
                foreign key (IdStatusUsuario) references STATUS_USUARIO(IdStatusUsuario),
                foreign key (IdGenero) references GENERO(IdGenero),
                foreign key (IdSucursal) references SUCURSAL(IdSucursal),
                foreign key (IdRole) references ROLE(IdRole)
            )`
        ];

        for (const sql of tablasSQL) {
            await connection.execute(sql);
            console.log(`Tabla creada: ${sql.split(' ')[2]}`);
        }

        // Insertar datos iniciales
        await connection.execute(
            `INSERT INTO EMPRESA (Nombre, Direccion, Nit, PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales, PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear, PasswordCantidadNumeros, PasswordCantidadPreguntasValidar, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Software Inc.', 'San Jose Pinula, Guatemala', '12345678-9', 1, 1, 1, 60, 8, 5, 2, 1, new Date(), 'system', null, null]
        );

        await connection.execute(
            `INSERT INTO SUCURSAL (Nombre, Direccion, IdEmpresa, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['Oficinas Centrales', 'San Jose Pinula, Guatemala', 1, new Date(), 'system', null, null]
        );

        console.log('Datos iniciales insertados correctamente');

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexión cerrada');
        }
    }
}

// Ejecutar inicialización
initDatabase();