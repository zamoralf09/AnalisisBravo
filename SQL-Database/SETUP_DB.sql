DROP SCHEMA IF EXISTS ProyectoAnalisis;
CREATE SCHEMA IF NOT EXISTS ProyectoAnalisis;
USE ProyectoAnalisis;

-- ===============================================================
-- FASE 1
-- ===============================================================

-- Tabla: EMPRESA
CREATE TABLE EMPRESA(
	IdEmpresa INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(100) NOT NULL,
	Direccion VARCHAR(200) NOT NULL,
	Nit VARCHAR(20) NOT NULL,
	PasswordCantidadMayusculas INT,
	PasswordCantidadMinusculas INT,
	PasswordCantidadCaracteresEspeciales INT,
	PasswordCantidadCaducidadDias INT,
	PasswordLargo INT,
	PasswordIntentosAntesDeBloquear INT,
	PasswordCantidadNumeros INT,
	PasswordCantidadPreguntasValidar INT,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdEmpresa)
);

INSERT INTO EMPRESA (
    Nombre, Direccion, Nit, PasswordCantidadMayusculas,
    PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales,
    PasswordCantidadCaducidadDias, PasswordLargo,
    PasswordIntentosAntesDeBloquear, PasswordCantidadNumeros,
    PasswordCantidadPreguntasValidar, FechaCreacion,
    UsuarioCreacion, FechaModificacion, UsuarioModificacion
)
VALUES (
    'Software Inc.', 'San Jose Pinula, Guatemala', '12345678-9', 1,
    1, 1, 60, 8,
    5, 2, 1, NOW(),
    'system', NULL, NULL
);

-- Tabla: SUCURSAL
CREATE TABLE SUCURSAL(
	IdSucursal INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(100) NOT NULL,
	Direccion VARCHAR(200) NOT NULL,
	IdEmpresa INT NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdSucursal),
	FOREIGN KEY (IdEmpresa) REFERENCES EMPRESA(IdEmpresa)
);

INSERT INTO SUCURSAL (
    Nombre, Direccion, IdEmpresa, FechaCreacion,
    UsuarioCreacion, FechaModificacion, UsuarioModificacion
)
VALUES (
    'Oficinas Centrales', 'San Jose Pinula, Guatemala', 1, NOW(),
    'system', NULL, NULL
);

-- Tabla: STATUS_USUARIO
CREATE TABLE STATUS_USUARIO(
	IdStatusUsuario INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(100) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdStatusUsuario)
);

INSERT INTO STATUS_USUARIO (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES 
('Activo', NOW(), 'system', NULL, NULL),
('Bloqueado por intentos de acceso', NOW(), 'system', NULL, NULL),
('Inactivo', NOW(), 'system', NULL, NULL);

-- Tabla: GENERO
CREATE TABLE GENERO(
	IdGenero INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(100) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdGenero)
);

INSERT INTO GENERO (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES
    ('Masculino', NOW(), 'system', NULL, NULL),
    ('Femenino', NOW(), 'system', NULL, NULL);

-- Tabla: ROLE
CREATE TABLE ROLE(
	IdRole INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdRole)
);

INSERT INTO ROLE (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES 
(
    'Administrador', NOW(), 'system', NULL, NULL
),
(
    'Sin Opciones', NOW(), 'system', NULL, NULL
);

-- Tabla: USUARIO
CREATE TABLE USUARIO(
	IdUsuario VARCHAR(100) NOT NULL,
	Nombre VARCHAR(100) NOT NULL,
	Apellido VARCHAR(100) NOT NULL,
	FechaNacimiento DATE NOT NULL,
	IdStatusUsuario INT NOT NULL,
	Password VARCHAR(100) NOT NULL,
	IdGenero INT NOT NULL,
	UltimaFechaIngreso DATETIME,
	IntentosDeAcceso INT,
	SesionActual VARCHAR(100),
	UltimaFechaCambioPassword DATETIME,
	CorreoElectronico VARCHAR(100),
	RequiereCambiarPassword INT,
	Fotografia MEDIUMBLOB,
	TelefonoMovil VARCHAR(30),
	IdSucursal INT NOT NULL,
	Pregunta VARCHAR(200) NOT NULL,
	Respuesta VARCHAR(200) NOT NULL,
    IdRole INT NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdUsuario),
	FOREIGN KEY (IdStatusUsuario) REFERENCES STATUS_USUARIO(IdStatusUsuario),
	FOREIGN KEY (IdGenero) REFERENCES GENERO(IdGenero),
	FOREIGN KEY (IdSucursal) REFERENCES SUCURSAL(IdSucursal),
    FOREIGN KEY (IdRole) REFERENCES ROLE(IdRole)
);

INSERT INTO USUARIO (
    IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario,
    Password, IdGenero, UltimaFechaIngreso, IntentosDeAcceso,
    SesionActual, UltimaFechaCambioPassword, CorreoElectronico,
    RequiereCambiarPassword, Fotografia, TelefonoMovil,
    IdSucursal, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion, Pregunta, Respuesta, IdRole
)
VALUES 
(
    'system', 'Nologin', 'Nologin', '1990-05-15', 1,
    MD5('erpwijoeli'), 1, NULL, 0,
    NULL, NULL, 'system@example.com',
    1, NULL, '555-1234567',
    1, NOW(), 'system', NULL, NULL, '¿Nombre de tu primera mascota?', 'Rex', 2
),
(
    'Administrador', 'Administrador', 'IT', '1990-05-15', 1,
    MD5('ITAdmin'), 1, NULL, 0,
    NULL, NULL, 'itadmin@example.com',
    1, NULL, '555-1234567',
    1, NOW(), 'system', NULL, NULL, '¿Nombre de tu curso preferido?', 'Analisis de Sistemas II', 1
);

-- Tabla: MODULO
CREATE TABLE MODULO( 
	IdModulo INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50) NOT NULL,
	OrdenMenu INT NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdModulo)
);

INSERT INTO MODULO (
    Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion 
)
VALUES
(
    'Seguridad', 1, NOW(), 'system'
),
(
    'Cuenta Corriente Por Cobrar', 2, NOW(), 'system'
);

-- Tabla: MENU
CREATE TABLE MENU(
	IdMenu INT NOT NULL AUTO_INCREMENT,
	IdModulo INT NOT NULL,
	Nombre VARCHAR(50) NOT NULL,
	OrdenMenu INT NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdMenu),
	FOREIGN KEY (IdModulo) REFERENCES MODULO(IdModulo)
);

INSERT INTO MENU (
    IdModulo, Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion 
)
VALUES
-- Módulo Seguridad
(
    1, 'Parametros Generales', 1, NOW(), 'system'
),
(
    1, 'Acciones', 2, NOW(), 'system'
),
(
    1, 'Estadisticas', 3, NOW(), 'system'
),
(
    1, 'Procedimientos Almacenados', 4, NOW(), 'system'
),
-- Módulo Cuenta Corriente
(
    2, 'Parametros Generales', 1, NOW(), 'system'
),
(
    2, 'Gestion de Cuenta Corriente', 2, NOW(), 'system'
),
(
    2, 'Reportes', 3, NOW(), 'system'
),
(
    2, 'Procesos', 4, NOW(), 'system'
);

-- Tabla: OPCION
CREATE TABLE OPCION(
	IdOpcion INT NOT NULL AUTO_INCREMENT,
	IdMenu INT NOT NULL,
	Nombre VARCHAR(50) NOT NULL,
	OrdenMenu INT NOT NULL,
	Pagina VARCHAR(100) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdOpcion),
	FOREIGN KEY (IdMenu) REFERENCES MENU(IdMenu)
);

INSERT INTO OPCION (
    IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion 
)
VALUES
-- Opciones del Módulo Seguridad
(
    1, 'Empresas', 1, 'modules/empresas.html', NOW(), 'system'  /*   idOpcion = 1   */
),
(
    1, 'Sucursales', 2, 'modules/sucursales.html', NOW(), 'system'  /*   idOpcion = 2   */
),
(
    1, 'Generos', 3, 'modules/generos.html', NOW(), 'system'   /*   idOpcion = 3   */
),
(
    1, 'Estatus Usuario', 4, 'modules/status-usuario.html', NOW(), 'system'  /*   idOpcion = 4   */
),
(
    1, 'Roles', 5, 'modules/roles.html', NOW(), 'system'  /*   idOpcion = 5   */
),
(
    1, 'Modulos', 6, 'modules/modulos.html', NOW(), 'system'   /*   idOpcion = 6   */
),
(
    1, 'Menus', 7, 'modules/menus.html', NOW(), 'system'   /*   idOpcion = 7   */
),
(
    1, 'Opciones', 8, 'modules/opciones.html', NOW(), 'system'   /*   idOpcion = 8   */
),
(
    2, 'Usuarios', 1, 'modules/usuarios.html', NOW(), 'system'   /*   idOpcion = 9   */
),
(
    2, 'Asignar Opciones a un Role', 2, 'modules/asignar-opciones.html', NOW(), 'system'   /*   idOpcion = 10   */
),
-- Opciones del Módulo Cuenta Corriente
(
    5, 'Status de Cuentas', 1, 'cuenta_corriente/status_cuentas.html', NOW(), 'system' /*   IdOpcion = 11  */
),
(
    5, 'Estado Civil de Personas', 2, 'cuenta_corriente/estado_civil.html', NOW(), 'system' /*   IdOpcion = 12  */
),
(
    5, 'Tipos de Documentos', 3, 'cuenta_corriente/tipos_documento.html', NOW(), 'system'  /*   IdOpcion = 13  */
),
(
    5, 'Tipos de Movimientos Cuenta Corriente', 4, 'cuenta_corriente/tipos_movimiento_cxc.html', NOW(), 'system'  /*   IdOpcion = 14  */
),
(
    5, 'Tipos de Cuentas', 5, 'cuenta_corriente/tipos_saldo_cuenta.html', NOW(), 'system'  /*   IdOpcion = 15  */
),
(
    6, 'Gestion de Personas', 1, 'cuenta_corriente/personas.html', NOW(), 'system'   /*   IdOpcion = 16  */
),
(
    6, 'Gestion de Cuentas', 2, 'cuenta_corriente/saldo_cuenta.html', NOW(), 'system'   /*   IdOpcion = 17  */
),
(
    6, 'Consulta de Saldos', 3, 'cuenta_corriente/consulta_saldo.html', NOW(), 'system'   /*   IdOpcion = 18  */
),
(
    7, 'Estado de Cuenta', 1, 'cuenta_corriente/estado_cuenta.html', NOW(), 'system'   /*   IdOpcion = 19  */
),
(
    8, 'Grabacion de Movimientos', 1, 'cuenta_corriente/grabacion_movimientos.html', NOW(), 'system'   /*   IdOpcion = 20  */
),
(
    8, 'Cierre de Mes', 2, 'cuenta_corriente/cierre_mes.html', NOW(), 'system'   /*   IdOpcion = 21  */
);

-- Tabla: ROLE_OPCION
CREATE TABLE ROLE_OPCION(
	IdRole INT NOT NULL,
	IdOpcion INT NOT NULL,
	Alta INT NOT NULL,
	Baja INT NOT NULL,
	Cambio INT NOT NULL,
	Imprimir INT NOT NULL,
	Exportar INT NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdRole,IdOpcion),
	FOREIGN KEY (IdRole) REFERENCES ROLE(IdRole),
	FOREIGN KEY (IdOpcion) REFERENCES OPCION(IdOpcion)
);

-- Asignar todas las opciones al rol Administrador
INSERT INTO ROLE_OPCION (IdRole, IdOpcion, Alta, Baja, Cambio, Imprimir, Exportar, FechaCreacion, UsuarioCreacion)
VALUES
(1,1,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,2,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,3,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,4,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,5,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,6,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,7,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,8,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,9,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,10,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,11,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,12,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,13,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,14,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,15,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,16,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,17,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,18,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,19,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,20,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system'),
(1,21,TRUE,TRUE,TRUE,TRUE,TRUE,NOW(),'system');

-- Tabla: TIPO_ACCESO
CREATE TABLE TIPO_ACCESO( 
	IdTipoAcceso INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(100) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdTipoAcceso)
);

INSERT INTO TIPO_ACCESO (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES 
(
    'Acceso Concedido', NOW(), 'system', NULL, NULL
),
(
    'Bloqueado - Password incorrecto/Numero de intentos exedidos', NOW(), 'system', NULL, NULL
),
(
    'Usuario Inactivo', NOW(), 'system', NULL, NULL
),
(
    'Usuario ingresado no existe', NOW(), 'system', NULL, NULL
);

-- Tabla: BITACORA_ACCESO
CREATE TABLE BITACORA_ACCESO(
	IdBitacoraAcceso INT NOT NULL AUTO_INCREMENT,
	IdUsuario VARCHAR(100) NOT NULL,
	IdTipoAcceso INT NOT NULL,
	FechaAcceso DATETIME NOT NULL,
	HttpUserAgent VARCHAR(200),
	DireccionIp VARCHAR(50),
	Accion VARCHAR(100), 
	SistemaOperativo VARCHAR(50),
	Dispositivo VARCHAR(50),
	Browser VARCHAR(50),
	Sesion VARCHAR(100),
	PRIMARY KEY (IdBitacoraAcceso),
	FOREIGN KEY (IdTipoAcceso) REFERENCES TIPO_ACCESO(IdTipoAcceso)
);

-- ===============================================================
-- FASE 2
-- ===============================================================

-- Tabla: ESTADO_CIVIL
CREATE TABLE ESTADO_CIVIL(
	IdEstadoCivil INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdEstadoCivil)
);

INSERT INTO ESTADO_CIVIL(Nombre, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion)
VALUES
('Casado(a)', NOW(), 'system', NULL, NULL),
('Soltero(a)', NOW(), 'system', NULL, NULL),
('Divorciado(a)', NOW(), 'system', NULL, NULL),
('Viudo(a)', NOW(), 'system', NULL, NULL),
('Union de hecho', NOW(), 'system', NULL, NULL);

-- Tabla: TIPO_DOCUMENTO
CREATE TABLE TIPO_DOCUMENTO(
	IdTipoDocumento INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdTipoDocumento)	
);

INSERT INTO TIPO_DOCUMENTO(Nombre, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion)
VALUES
('Documento Personal de Identificacion (DPI)', NOW(), 'system', NULL, NULL),
('Pasaporte', NOW(), 'system', NULL, NULL),
('NIT', NOW(), 'system', NULL, NULL),
('Licencia de Conducir', NOW(), 'system', NULL, NULL),
('Seguro Social IGSS', NOW(), 'system', NULL, NULL);

-- Tabla: PERSONA
CREATE TABLE PERSONA(
	IdPersona INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50) NOT NULL,
	Apellido VARCHAR(50) NOT NULL,
	FechaNacimiento DATE NOT NULL,
	IdGenero INT NOT NULL,
	Direccion VARCHAR(100) NOT NULL,
	Telefono VARCHAR(50) NOT NULL,
	CorreoElectronico VARCHAR(50),
	IdEstadoCivil INT NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdPersona),
	FOREIGN KEY (IdGenero) REFERENCES GENERO(IdGenero),
	FOREIGN KEY (IdEstadoCivil) REFERENCES ESTADO_CIVIL(IdEstadoCivil)
);

-- Insertar 10 personas de ejemplo
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) 
VALUES 
('Juan', 'Pérez', '1985-03-15', 1, 'Zona 1, Guatemala', '502-12345678', 'juan.perez@example.com', 1, NOW(), 'system'),
('María', 'García', '1990-07-22', 2, 'Zona 10, Guatemala', '502-23456789', 'maria.garcia@example.com', 2, NOW(), 'system'),
('Carlos', 'López', '1988-11-10', 1, 'Zona 5, Mixco', '502-34567890', 'carlos.lopez@example.com', 3, NOW(), 'system'),
('Ana', 'Martínez', '1995-02-28', 2, 'Zona 2, Villa Nueva', '502-45678901', 'ana.martinez@example.com', 2, NOW(), 'system'),
('Luis', 'Rodríguez', '1982-09-05', 1, 'Zona 7, San Miguel Petapa', '502-56789012', 'luis.rodriguez@example.com', 1, NOW(), 'system'),
('Patricia', 'Hernández', '1992-12-18', 2, 'Zona 4, Amatitlán', '502-67890123', 'patricia.hernandez@example.com', 4, NOW(), 'system'),
('Miguel', 'González', '1987-06-30', 1, 'Zona 3, Villa Canales', '502-78901234', 'miguel.gonzalez@example.com', 1, NOW(), 'system'),
('Laura', 'Ramírez', '1993-04-12', 2, 'Zona 8, Santa Catarina Pinula', '502-89012345', 'laura.ramirez@example.com', 5, NOW(), 'system'),
('Fernando', 'Torres', '1986-08-25', 1, 'Zona 6, San Juan Sacatepéquez', '502-90123456', 'fernando.torres@example.com', 2, NOW(), 'system'),
('Sofía', 'Flores', '1991-10-08', 2, 'Zona 9, Chinautla', '502-01234567', 'sofia.flores@example.com', 3, NOW(), 'system');

-- Tabla: DOCUMENTO_PERSONA
CREATE TABLE DOCUMENTO_PERSONA(
	IdTipoDocumento INT NOT NULL,
	IdPersona INT NOT NULL,
	NoDocumento VARCHAR(50),
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdTipoDocumento,IdPersona),
	FOREIGN KEY (IdTipoDocumento) REFERENCES TIPO_DOCUMENTO(IdTipoDocumento),
	FOREIGN KEY (IdPersona) REFERENCES PERSONA(IdPersona)
);

-- Insertar documentos para las 10 personas de ejemplo
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) 
VALUES 
(1, 1, '2345 12345 0101', NOW(), 'system'),
(1, 2, '2345 23456 0101', NOW(), 'system'),
(1, 3, '2345 34567 0101', NOW(), 'system'),
(1, 4, '2345 45678 0101', NOW(), 'system'),
(1, 5, '2345 56789 0101', NOW(), 'system'),
(1, 6, '2345 67890 0101', NOW(), 'system'),
(1, 7, '2345 78901 0101', NOW(), 'system'),
(1, 8, '2345 89012 0101', NOW(), 'system'),
(1, 9, '2345 90123 0101', NOW(), 'system'),
(1, 10, '2345 01234 0101', NOW(), 'system');

-- Tabla: STATUS_CUENTA
CREATE TABLE STATUS_CUENTA(
	IdStatusCuenta INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdStatusCuenta)	
);

INSERT INTO STATUS_CUENTA(Nombre, FechaCreacion, UsuarioCreacion)
VALUES
('Cuenta Activa', NOW(), 'system'),
('Cuenta Cancelada', NOW(), 'system'),
('Cuenta en Cobro Juridico', NOW(), 'system');

-- Tabla: TIPO_SALDO_CUENTA
CREATE TABLE TIPO_SALDO_CUENTA(
	IdTipoSaldoCuenta INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(50),
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdTipoSaldoCuenta)
);

INSERT INTO TIPO_SALDO_CUENTA(Nombre, FechaCreacion, UsuarioCreacion)
VALUES
('Prestamo Personal', NOW(), 'system'),
('Tarjeta de Credito', NOW(), 'system');

-- Tabla: SALDO_CUENTA
CREATE TABLE SALDO_CUENTA(
	IdSaldoCuenta INT NOT NULL AUTO_INCREMENT,
	IdPersona INT NOT NULL,
	IdStatusCuenta INT NOT NULL,
	IdTipoSaldoCuenta INT NOT NULL,
	SaldoAnterior DECIMAL(10,2),
	Debitos DECIMAL(10,2),
	Creditos DECIMAL(10,2),
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdSaldoCuenta),
	FOREIGN KEY (IdPersona) REFERENCES PERSONA(IdPersona),
	FOREIGN KEY (IdStatusCuenta) REFERENCES STATUS_CUENTA(IdStatusCuenta),
	FOREIGN KEY (IdTipoSaldoCuenta) REFERENCES TIPO_SALDO_CUENTA(IdTipoSaldoCuenta)
);

-- Insertar cuentas para las 10 personas de ejemplo
INSERT INTO SALDO_CUENTA (IdPersona, IdStatusCuenta, IdTipoSaldoCuenta, SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion) 
VALUES 
(1, 1, 1, 0, 0, 0, NOW(), 'system'),
(2, 1, 1, 0, 0, 0, NOW(), 'system'),
(3, 1, 1, 0, 0, 0, NOW(), 'system'),
(4, 1, 1, 0, 0, 0, NOW(), 'system'),
(5, 1, 1, 0, 0, 0, NOW(), 'system'),
(6, 1, 1, 0, 0, 0, NOW(), 'system'),
(7, 1, 1, 0, 0, 0, NOW(), 'system'),
(8, 1, 1, 0, 0, 0, NOW(), 'system'),
(9, 1, 1, 0, 0, 0, NOW(), 'system'),
(10, 1, 1, 0, 0, 0, NOW(), 'system');

-- Tabla: PERIODO_CIERRE_MES
CREATE TABLE PERIODO_CIERRE_MES(
    Anio INT NOT NULL,
    Mes INT NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFinal DATE NOT NULL,
    FechaCierre DATETIME,
    PRIMARY KEY (Anio,Mes)
);

INSERT INTO PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) 
VALUES
(2025,6,'2025-06-01','2025-06-30',NULL),
(2025,7,'2025-07-01','2025-07-31',NULL),
(2025,8,'2025-08-01','2025-08-31',NULL),
(2025,9,'2025-09-01','2025-09-30',NULL),
(2025,10,'2025-10-01','2025-10-31',NULL),
(2025,11,'2025-11-01','2025-11-30',NULL),
(2025,12,'2025-12-01','2025-12-31',NULL);

-- Tabla: SALDO_CUENTA_HIST
CREATE TABLE SALDO_CUENTA_HIST(
	Anio INT NOT NULL,
	Mes INT NOT NULL,
	IdSaldoCuenta INT NOT NULL,
	IdPersona INT NOT NULL,
	IdStatusCuenta INT NOT NULL,
	IdTipoSaldoCuenta INT NOT NULL,
	SaldoAnterior DECIMAL(10,2),
	Debitos DECIMAL(10,2),
	Creditos DECIMAL(10,2),
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (Anio,Mes,IdSaldoCuenta),
	FOREIGN KEY (IdPersona) REFERENCES PERSONA(IdPersona),
	FOREIGN KEY (IdStatusCuenta) REFERENCES STATUS_CUENTA(IdStatusCuenta),
	FOREIGN KEY (IdTipoSaldoCuenta) REFERENCES TIPO_SALDO_CUENTA(IdTipoSaldoCuenta),
	FOREIGN KEY (Anio,Mes) REFERENCES PERIODO_CIERRE_MES(Anio,Mes)
);

-- Tabla: TIPO_MOVIMIENTO_CXC
CREATE TABLE TIPO_MOVIMIENTO_CXC(
	IdTipoMovimientoCXC INT NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(75) NOT NULL,
	OperacionCuentaCorriente INT NOT NULL, /* 1 es Cargo (Sumar en la CXC) y 2 es Abono (Restar en la CXC) */ 
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdTipoMovimientoCXC)
);

/* La operacion de la cuenta corriente es 1=Cargo (Débito) 2=Abono (Crédito) */
INSERT INTO TIPO_MOVIMIENTO_CXC(Nombre, OperacionCuentaCorriente, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion)
VALUES
('Nota de Debito', 1, NOW(), 'system', NULL, NULL),
('Consumo', 1, NOW(), 'system', NULL, NULL),
('Reversa de Pago', 1, NOW(), 'system', NULL, NULL),
('Cargos por Servicio', 1, NOW(), 'system', NULL, NULL),
('Cargos por Mora', 1, NOW(), 'system', NULL, NULL),
('Intereses Bonificables por consumo', 1, NOW(), 'system', NULL, NULL),
('Nota de Credito', 2, NOW(), 'system', NULL, NULL),
('Pago Recibido', 2, NOW(), 'system', NULL, NULL),
('Reversa de Consumo', 2, NOW(), 'system', NULL, NULL);

CREATE TABLE MOVIMIENTO_CUENTA(
	IdMovimientoCuenta INT NOT NULL AUTO_INCREMENT,
	IdSaldoCuenta INT NOT NULL,
	IdTipoMovimientoCXC INT NOT NULL,
	FechaMovimiento DATETIME NOT NULL,
	ValorMovimiento DECIMAL(10,2) NOT NULL,
	ValorMovimientoPagado DECIMAL(10,2) NOT NULL,
	GeneradoAutomaticamente BOOLEAN NOT NULL,
	Descripcion VARCHAR(75) NOT NULL,
	FechaCreacion DATETIME NOT NULL,
	UsuarioCreacion VARCHAR(100) NOT NULL,
	FechaModificacion DATETIME,
	UsuarioModificacion VARCHAR(100),
	PRIMARY KEY (IdMovimientoCuenta),
	FOREIGN KEY (IdSaldoCuenta) REFERENCES SALDO_CUENTA(IdSaldoCuenta),
	FOREIGN KEY (IdTipoMovimientoCXC) REFERENCES TIPO_MOVIMIENTO_CXC(IdTipoMovimientoCXC)
);


-- VERIFICACION
SELECT 
    m.IdModulo, m.Nombre AS Modulo, 
    me.IdMenu, me.Nombre AS Menu, 
    o.IdOpcion, o.Nombre AS Opcion, 
    o.Pagina 
FROM MODULO AS m 
INNER JOIN MENU AS me ON m.IdModulo = me.IdModulo 
INNER JOIN OPCION o ON o.IdMenu = me.IdMenu
ORDER BY m.IdModulo, me.IdMenu, o.OrdenMenu;

