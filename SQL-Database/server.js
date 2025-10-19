const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'sistema_seguridad_bravo_jwt_secret_2025';

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// Servir solo recursos estáticos públicos (css, js, images, assets)
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Servir login.html y index.html sin autenticación
app.get(['/login.html', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', req.path));
});

// Servir HTML protegidos solo si hay sesión (la protección real la hace el middleware authenticateToken)
app.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', req.path));
});
const dbConfig = {
    host: 'localhost',
    user: 'manager',
    password: 'manager',
    database: 'proyectoAnalisis',
    connectTimeout: 60000,
    charset: 'utf8mb4'
};

let db;

async function connectToDatabase() {
    try {
        console.log('Conectando a MySQL con usuario: manager');
        db = await mysql.createConnection(dbConfig);
        console.log('Conectado a la base de datos MySQL');
        await verificarYCrearTablas();

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_BAD_DB_ERROR') {
            console.log('Error de acceso, intentando configurar la base de datos...');
            await configurarBaseDatos();
        } else {
            console.error('Error de conexión grave:', error.message);
        }
    }
}

// Función para verificar y crear tablas
async function verificarYCrearTablas() {
    try {
        const [tablas] = await db.execute(`SHOW TABLES LIKE 'USUARIO'`);

        if (tablas.length === 0) {
            console.log('Tablas no encontradas, creando estructura inicial...');
            await crearTablasSistema();
            await insertarDatosIniciales();
        } else {
            console.log('Tablas verificadas correctamente');
            const [usuarios] = await db.execute('SELECT * FROM USUARIO WHERE Nombre = ?', ['manager']);
            if (usuarios.length === 0) {
                await crearUsuarioManager();
            }
        }
    } catch (error) {
        console.error('Error verificando tablas:', error.message);
    }
}

async function crearTablasSistema() {
    // para evitar errores primero las tablas sin los foreign keys
    const tablasBase = [
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

        `CREATE TABLE TIPO_ACCESO (
            IdTipoAcceso int not null auto_increment,
            Nombre varchar(100) not null,
            FechaCreacion datetime not null,
            UsuarioCreacion varchar(100) not null,
            FechaModificacion datetime,
            UsuarioModificacion varchar(100),
            primary key (IdTipoAcceso)
        )`
    ];

    // Tablas que dependen de las básicas
    const tablasDependientes = [
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

        `CREATE TABLE MODULO (
            IdModulo int not null auto_increment,
            Nombre varchar(50) not null,
            OrdenMenu int not null,
            FechaCreacion datetime not null,
            UsuarioCreacion varchar(100) not null,
            FechaModificacion datetime,
            UsuarioModificacion varchar(100),
            primary key (IdModulo)
        )`,

        `CREATE TABLE MENU (
            IdMenu int not null auto_increment,
            IdModulo int not null,
            Nombre varchar(50) not null,
            OrdenMenu int not null,
            FechaCreacion datetime not null,
            UsuarioCreacion varchar(100) not null,
            FechaModificacion datetime,
            UsuarioModificacion varchar(100),
            primary key (IdMenu),
            foreign key (IdModulo) references MODULO(IdModulo)
        )`,

        `CREATE TABLE OPCION (
            IdOpcion int not null auto_increment,
            IdMenu int not null,
            Nombre varchar(50) not null,
            OrdenMenu int not null,
            Pagina varchar(100) not null,
            FechaCreacion datetime not null,
            UsuarioCreacion varchar(100) not null,
            FechaModificacion datetime,
            UsuarioModificacion varchar(100),
            primary key (IdOpcion),
            foreign key (IdMenu) references MENU(IdMenu)
        )`
    ];

    // Tablas con múltiples dependencias
    const tablasComplejas = [
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
            CorreoElectronico varchar(100) UNIQUE,
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
        )`,

        `CREATE TABLE ROLE_OPCION (
            IdRole int not null,
            IdOpcion int not null,
            Alta int not null,
            Baja int not null,
            Cambio int not null,
            Imprimir int not null,
            Exportar int not null,
            FechaCreacion datetime not null,
            UsuarioCreacion varchar(100) not null,
            FechaModificacion datetime,
            UsuarioModificacion varchar(100),
            primary key (IdRole,IdOpcion),
            foreign key (IdRole) references ROLE(IdRole),
            foreign key (IdOpcion) references OPCION(IdOpcion)
        )`,

        `CREATE TABLE BITACORA_ACCESO (
            IdBitacoraAcceso int not null auto_increment,
            IdUsuario varchar(100) not null,
            IdTipoAcceso int not null,
            FechaAcceso datetime not null,
            HttpUserAgent varchar(200),
            DireccionIp varchar(50),
            Accion varchar(100), 
            SistemaOperativo varchar(50),
            Dispositivo varchar(50),
            Browser varchar(50),
            Sesion varchar(100),
            primary key (IdBitacoraAcceso),
            foreign key (IdTipoAcceso) references TIPO_ACCESO(IdTipoAcceso),
            foreign key (IdUsuario) references USUARIO(IdUsuario)
        )`
    ];

    // Crear en orden correcto
    for (const sql of [...tablasBase, ...tablasDependientes, ...tablasComplejas]) {
        try {
            await db.execute(sql);
            console.log('Tabla creada:', sql.split(' ')[2]);
        } catch (error) {
            console.error('Error creando tabla:', error.message);
        }
    }
}

// Función para insertar datos iniciales
async function insertarDatosIniciales() {
    try {
        // Insertar EMPRESA
        await db.execute(
            'INSERT INTO EMPRESA (Nombre, Direccion, Nit, PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales, PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear, PasswordCantidadNumeros, PasswordCantidadPreguntasValidar, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
            ['Software Inc.', 'San Jose Pinula, Guatemala', '12345678-9', 1, 1, 1, 60, 8, 5, 2, 1, 'system']
        );

        // Insertar SUCURSAL
        await db.execute(
            'INSERT INTO SUCURSAL (Nombre, Direccion, IdEmpresa, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, NOW(), ?)',
            ['Oficinas Centrales', 'San Jose Pinula, Guatemala', 1, 'system']
        );

        // Insertar GÉNEROS
        await db.execute(
            'INSERT INTO GENERO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Masculino', 'system']
        );
        await db.execute(
            'INSERT INTO GENERO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Femenino', 'system']
        );

        // Insertar STATUS USUARIO
        await db.execute(
            'INSERT INTO STATUS_USUARIO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Activo', 'system']
        );
        await db.execute(
            'INSERT INTO STATUS_USUARIO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Inactivo', 'system']
        );
        await db.execute(
            'INSERT INTO STATUS_USUARIO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Bloqueado', 'system']
        );

        // Insertar ROLES
        await db.execute(
            'INSERT INTO ROLE (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Administrador', 'system']
        );
        await db.execute(
            'INSERT INTO ROLE (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Usuario', 'system']
        );

        // Insertar Usuario
        await db.execute(
            `INSERT INTO USUARIO (
                IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario,
                Password, IdGenero, UltimaFechaIngreso, IntentosDeAcceso,
                SesionActual, UltimaFechaCambioPassword, CorreoElectronico,
                RequiereCambiarPassword, Fotografia, TelefonoMovil,
                IdSucursal, FechaCreacion, UsuarioCreacion,
                FechaModificacion, UsuarioModificacion, Pregunta, Respuesta, IdRole
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
            [
                'system', 'Nologin', 'Nologin', '1990-05-15', 1,
                md5('erpwijoeli'), 1, null, 0,
                null, null, 'system@example.com',
                1, null, '555-1234567',
                1, 'system', null, null, '¿Nombre de tu primera mascota?', 'Rex', 2
            ]
        );
        // Usuario 'Administrador'
        await db.execute(
            `INSERT INTO USUARIO (
                IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario,
                Password, IdGenero, UltimaFechaIngreso, IntentosDeAcceso,
                SesionActual, UltimaFechaCambioPassword, CorreoElectronico,
                RequiereCambiarPassword, Fotografia, TelefonoMovil,
                IdSucursal, FechaCreacion, UsuarioCreacion,
                FechaModificacion, UsuarioModificacion, Pregunta, Respuesta, IdRole
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
            [
                'Administrador', 'Administrador', 'IT', '1990-05-15', 1,
                md5('ITAdmin'), 1, null, 0,
                null, null, 'itadmin@example.com',
                1, null, '555-1234567',
                1, 'system', null, null, '¿Nombre de tu curso preferido?', 'Analisis de Sistemas II', 1
            ]
        );
        // Usuario 'manager'
        const managerPassword = md5('manager');
        await db.execute(
            `INSERT INTO USUARIO (IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario, Password, IdGenero, CorreoElectronico, RequiereCambiarPassword, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole, FechaCreacion, UsuarioCreacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
            ['manager', 'Manager', 'Sistema', '1990-01-01', 1, managerPassword, 1, 'manager@sistema.com', 0, '12345678', 1, '¿Nombre del 5to integrante?', 'Jorge #5', 1, 'system']
        );
        // Insertar MODULO 
        let idModuloSeguridad;
        const [moduloRows] = await db.execute('SELECT IdModulo FROM MODULO WHERE Nombre = ?', ['Seguridad']);
        if (moduloRows.length === 0) {
            const [result] = await db.execute(
                'INSERT INTO MODULO (Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion) VALUES (?, ?, NOW(), ?)',
                ['Seguridad', 1, 'system']
            );
            idModuloSeguridad = result.insertId;
        } else {
            idModuloSeguridad = moduloRows[0].IdModulo;
        }

        // Insertar MENUS 
        const menusIniciales = [
            { nombre: 'Parametros Generales', orden: 1 },
            { nombre: 'Acciones', orden: 2 },
            { nombre: 'Estadisticas', orden: 3 },
            { nombre: 'Procedimientos Almacenados', orden: 4 }
        ];
        for (const menu of menusIniciales) {
            const [menuRows] = await db.execute('SELECT 1 FROM MENU WHERE Nombre = ? AND IdModulo = ?', [menu.nombre, idModuloSeguridad]);
            if (menuRows.length === 0) {
                await db.execute(
                    'INSERT INTO MENU (IdModulo, Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, NOW(), ?)',
                    [idModuloSeguridad, menu.nombre, menu.orden, 'system']
                );
            }
        }

        // Insertar OPCIONES
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Empresas', 1, 'empresa.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Sucursales', 2, 'sucursal.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Generos', 3, 'genero.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Estatus Usuario', 4, 'status_usuario.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Roles', 5, 'role.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Modulos', 6, 'modulo.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Menus', 7, 'menu.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [1, 'Opciones', 3, 'opcion.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [2, 'Usuarios', 3, 'usuario.php', 'system']
        );
        await db.execute(
            'INSERT INTO OPCION (IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [2, 'Asignar Opciones a un Role', 3, 'asignacion_opcion_role.php', 'system']
        );

        //insertar Role_Opcion
        await db.execute(
            'INSERT INTO ROLE_OPCION (IdRole, IdOpcion, Alta, Baja, Cambio, Imprimir, Exportar, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
            [1, 1, 1, 1, 1, 1, 1,'system']
        );

        // Insertar TIPO_ACCESO
        await db.execute(
            'INSERT INTO TIPO_ACCESO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Acceso Concedido', 'system']
        );
        await db.execute(
            'INSERT INTO TIPO_ACCESO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Bloqueado - Password Incorrecto/Numero de intentos excedidos', 'system']
        );
        await db.execute(
            'INSERT INTO TIPO_ACCESO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Usuario Inactivo', 'system']
        );
        await db.execute(
            'INSERT INTO TIPO_ACCESO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            ['Usuario ingresado no existe', 'system']
        );

        console.log('Datos iniciales insertados correctamente');
        console.log('Usuarios iniciales creados: system, Administrador, manager');

    } catch (error) {
        console.error('Error insertando datos iniciales:', error.message);
    }
}

// Función para configurar la base de datos, solo si hay problemas de acceso
async function configurarBaseDatos() {
    try {
        const rootConfig = {
            host: 'localhost',
            user: 'root',
            password: 'root'
        };

        const rootConnection = await mysql.createConnection(rootConfig);
        console.log('Conectado como root, configurando base de datos...');

        // Crear base de datos si no existe
        await rootConnection.execute('CREATE DATABASE IF NOT EXISTS proyectoAnalisis');

        // Crear usuario manager si no existe
        await rootConnection.execute(`CREATE USER IF NOT EXISTS 'manager'@'localhost' IDENTIFIED BY 'manager'`);

        // Otorgar privilegios
        await rootConnection.execute(`GRANT ALL PRIVILEGES ON proyectoAnalisis.* TO 'manager'@'localhost'`);
        await rootConnection.execute(`GRANT ALL PRIVILEGES ON *.* TO 'manager'@'localhost' WITH GRANT OPTION`);
        await rootConnection.execute('FLUSH PRIVILEGES');

        await rootConnection.end();
        console.log('Base de datos y usuario manager configurados');

        // Reconectar con el usuario manager
        db = await mysql.createConnection(dbConfig);
        console.log('Conectado con usuario manager');

        await crearTablasSistema();
        await insertarDatosIniciales();

    } catch (error) {
        console.error('Error configurando base de datos:', error.message);
        console.log('⚠️  Nota: Si MySQL no tiene usuario root sin password,');
        console.log('   edita la variable rootConfig y coloca la contraseña correcta de root.');
    }
}

app.post('/api/recuperar-password', async (req, res) => {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Correo requerido' });
    try {
        const [usuarios] = await db.execute('SELECT IdUsuario FROM USUARIO WHERE CorreoElectronico = ?', [correo]);
        if (usuarios.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        const usuario = usuarios[0];
        // Generar token seguro
        const crypto = require('crypto');
        const token = crypto.randomBytes(24).toString('hex');
        const tokenFile = path.join(__dirname, 'recuperar.txt');
        // Guardar token en archivo .txt
        fs.writeFileSync(tokenFile, `${correo}|${token}|${Date.now()}`);
           res.json({ mensaje: 'Token generado. Revisa el archivo recuperar.txt', token, usuario });
    } catch (err) {
           console.error('Error generando token:', err);
           res.status(500).json({ error: 'Error generando token' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { correo, token, nuevaPassword } = req.body;
    if (!correo || !token || !nuevaPassword) return res.status(400).json({ error: 'Datos incompletos' });
    try {
        const tokenFile = path.join(__dirname, 'recuperar.txt');
        if (!fs.existsSync(tokenFile)) return res.status(400).json({ error: 'No hay token generado' });
        const contenido = fs.readFileSync(tokenFile, 'utf8');
        const [correoGuardado, tokenGuardado, fechaGuardado] = contenido.split('|');
        // Validar correo y token
        if (correo !== correoGuardado || token !== tokenGuardado) {
            return res.status(400).json({ error: 'Token o correo inválido' });
        }
        const expiracionMs = 15 * 60 * 1000;
        if (Date.now() - parseInt(fechaGuardado) > expiracionMs) {
            fs.unlinkSync(tokenFile);
            return res.status(400).json({ error: 'Token expirado' });
        }
        // Cambiar contraseña (encriptada)
        const hash = await bcrypt.hash(nuevaPassword, 10);
        await db.execute('UPDATE USUARIO SET Password = ?, RequiereCambiarPassword = 0 WHERE CorreoElectronico = ?', [hash, correo]);
        fs.unlinkSync(tokenFile);
            res.json({ mensaje: 'Contraseña actualizada correctamente', correo });
    } catch (err) {
            console.error('Error al cambiar contraseña:', err);
            res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
});

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
    const publicPaths = [
        '/api/login',
        '/login.html',
        '/css/',
        '/js/',
        '/images/',
        '/modules/',
        '/assets/',
        '/index.html'
    ];

    const isPublicPath = publicPaths.some(publicPath =>
        req.path.startsWith(publicPath) ||
        req.path === '/' ||
        req.path === ''
    );

    if (isPublicPath) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Para rutas HTML, redirigir al login
        if (req.accepts('html')) {
            return res.redirect('/login.html');
        }
        // Para APIs, devolver error JSON
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (req.accepts('html')) {
                return res.redirect('/login.html');
            }
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

app.use(authenticateToken);

function requireAdmin(req, res, next) {
    if (req.user?.rol !== 1 && req.user?.rol !== '1') {
        return res.status(403).json({ error: 'Solo el administrador puede realizar esta acción' });
    }
    next();
}

app.get('/api/permisos-usuario', async (req, res) => {
    try {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const idRole = req.user.rol;
        const [rows] = await db.execute(`
            SELECT o.IdOpcion, o.Nombre AS NombreOpcion, o.Pagina, m.Nombre AS NombreMenu, mo.Nombre AS NombreModulo,
                   ro.Alta, ro.Baja, ro.Cambio, ro.Imprimir, ro.Exportar
            FROM OPCION o
            JOIN MENU m ON o.IdMenu = m.IdMenu
            JOIN MODULO mo ON m.IdModulo = mo.IdModulo
            LEFT JOIN ROLE_OPCION ro ON ro.IdOpcion = o.IdOpcion AND ro.IdRole = ?
            ORDER BY mo.OrdenMenu, m.OrdenMenu, o.OrdenMenu
        `, [idRole]);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo permisos de usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Obtener permisos de opciones para un rol
app.get('/api/role-opciones/:idRole', requireAdmin, async (req, res) => {
    try {
        const { idRole } = req.params;
        const [rows] = await db.execute(`
            SELECT o.IdOpcion, o.Nombre AS NombreOpcion, m.Nombre AS NombreMenu, mo.Nombre AS NombreModulo,
                   ro.Alta, ro.Baja, ro.Cambio, ro.Imprimir, ro.Exportar
            FROM OPCION o
            JOIN MENU m ON o.IdMenu = m.IdMenu
            JOIN MODULO mo ON m.IdModulo = mo.IdModulo
            LEFT JOIN ROLE_OPCION ro ON ro.IdOpcion = o.IdOpcion AND ro.IdRole = ?
            ORDER BY mo.OrdenMenu, m.OrdenMenu, o.OrdenMenu
        `, [idRole]);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo permisos de opciones:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/role-opciones', requireAdmin, async (req, res) => {
    try {
        const { IdRole, IdOpcion, Alta, Baja, Cambio, Imprimir, Exportar } = req.body;
        if (!IdRole || !IdOpcion) {
            return res.status(400).json({ error: 'IdRole e IdOpcion son requeridos' });
        }
        const [exist] = await db.execute('SELECT 1 FROM ROLE_OPCION WHERE IdRole = ? AND IdOpcion = ?', [IdRole, IdOpcion]);
        if (exist.length > 0) {
            await db.execute(
                'UPDATE ROLE_OPCION SET Alta=?, Baja=?, Cambio=?, Imprimir=?, Exportar=?, FechaModificacion=NOW(), UsuarioModificacion=? WHERE IdRole=? AND IdOpcion=?',
                [Alta ? 1 : 0, Baja ? 1 : 0, Cambio ? 1 : 0, Imprimir ? 1 : 0, Exportar ? 1 : 0, req.user?.email || 'system', IdRole, IdOpcion]
            );
        } else {
            await db.execute(
                'INSERT INTO ROLE_OPCION (IdRole, IdOpcion, Alta, Baja, Cambio, Imprimir, Exportar, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
                [IdRole, IdOpcion, Alta ? 1 : 0, Baja ? 1 : 0, Cambio ? 1 : 0, Imprimir ? 1 : 0, Exportar ? 1 : 0, req.user?.email || 'system']
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error asignando permisos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.delete('/api/role-opciones/:idRole/:idOpcion', requireAdmin, async (req, res) => {
    try {
        const { idRole, idOpcion } = req.params;
        await db.execute('DELETE FROM ROLE_OPCION WHERE IdRole = ? AND IdOpcion = ?', [idRole, idOpcion]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando permisos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/login', async (req, res) => {
        // Función simple para extraer info del user-agent
        function parseUserAgent(ua) {
            ua = ua || '';
            let sistema = 'Desconocido';
            let dispositivo = 'Desconocido';
            let browser = 'Desconocido';
            if (/windows/i.test(ua)) sistema = 'Windows';
            else if (/android/i.test(ua)) sistema = 'Android';
            else if (/linux/i.test(ua)) sistema = 'Linux';
            else if (/iphone|ipad|ios/i.test(ua)) sistema = 'iOS';
            else if (/mac os/i.test(ua)) sistema = 'MacOS';

            if (/mobile|android|iphone|ipad/i.test(ua)) dispositivo = 'Mobile';
            else if (/windows|mac os|linux/i.test(ua)) dispositivo = 'Desktop';

            // Prioridad: Edge > Firefox > Opera > Chrome > Safari
            if (/edg/i.test(ua)) browser = 'Edge';
            else if (/firefox/i.test(ua)) browser = 'Firefox';
            else if (/opera|opr/i.test(ua)) browser = 'Opera';
            else if (/chrome/i.test(ua) && !/edg/i.test(ua) && !/opr|opera/i.test(ua) && !/firefox/i.test(ua)) browser = 'Chrome';
            else if (/safari/i.test(ua)) browser = 'Safari';

            return { sistema, dispositivo, browser };
        }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM USUARIO WHERE CorreoElectronico = ?', [email]);
        // Obtener info de agente y IP
        const userAgent = req.headers['user-agent'] || null;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
        // Si el usuario no existe
        if (users.length === 0) {
            // IdTipoAcceso = 4 (Usuario ingresado no existe)
            const { sistema, dispositivo, browser } = parseUserAgent(userAgent);
            await db.execute(
                'INSERT INTO BITACORA_ACCESO (IdUsuario, IdTipoAcceso, FechaAcceso, HttpUserAgent, DireccionIp, Accion, SistemaOperativo, Dispositivo, Browser) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)',
                [email || 'desconocido', 4, userAgent, ip, 'Intento de login', sistema, dispositivo, browser]
            );
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const user = users[0];
        // Si el usuario está bloqueado, no permitir login
        if (user.IdStatusUsuario === 3) {
            // IdTipoAcceso = 2 (Bloqueado - Password incorrecto/Numero de intentos exedidos)
            const { sistema, dispositivo, browser } = parseUserAgent(userAgent);
            await db.execute(
                'INSERT INTO BITACORA_ACCESO (IdUsuario, IdTipoAcceso, FechaAcceso, HttpUserAgent, DireccionIp, Accion, Sesion, SistemaOperativo, Dispositivo, Browser) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)',
                [user.IdUsuario, 2, userAgent, ip, 'Intento de login (bloqueado)', user.SesionActual, sistema, dispositivo, browser]
            );
            return res.status(403).json({ error: 'Bloqueado - Password incorrecto/Numero de intentos exedidos. Contacta a un administrador.' });
        }
        // Si el usuario está inactivo
        if (user.IdStatusUsuario === 2) {
            // IdTipoAcceso = 3 (Usuario Inactivo)
            const { sistema, dispositivo, browser } = parseUserAgent(userAgent);
            await db.execute(
                'INSERT INTO BITACORA_ACCESO (IdUsuario, IdTipoAcceso, FechaAcceso, HttpUserAgent, DireccionIp, Accion, Sesion, SistemaOperativo, Dispositivo, Browser) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)',
                [user.IdUsuario, 3, userAgent, ip, 'Intento de login (inactivo)', user.SesionActual, sistema, dispositivo, browser]
            );
            return res.status(403).json({ error: 'Usuario inactivo. Contacta a un administrador.' });
        }
        // Intentar con md5 (usuarios viejos)
        const hashedPassword = md5(password);
        let passwordMatch = hashedPassword === user.Password;
        // Si no coincide, intentar con bcrypt (usuarios nuevos)
        if (!passwordMatch) {
            try {
                passwordMatch = await bcrypt.compare(password, user.Password);
            } catch (e) {
                passwordMatch = false;
            }
        }
        if (passwordMatch) {
            // Login exitoso: actualizar UltimaFechaIngreso, IntentosDeAcceso, SesionActual
            const crypto = require('crypto');
            const sesionActual = crypto.randomBytes(16).toString('hex');
            await db.execute(
                'UPDATE USUARIO SET UltimaFechaIngreso = NOW(), IntentosDeAcceso = 0, SesionActual = ? WHERE IdUsuario = ?',
                [sesionActual, user.IdUsuario]
            );
            // IdTipoAcceso = 1 (Acceso Concedido)
            const { sistema, dispositivo, browser } = parseUserAgent(userAgent);
            await db.execute(
                'INSERT INTO BITACORA_ACCESO (IdUsuario, IdTipoAcceso, FechaAcceso, HttpUserAgent, DireccionIp, Accion, Sesion, SistemaOperativo, Dispositivo, Browser) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)',
                [user.IdUsuario, 1, userAgent, ip, 'Login exitoso', sesionActual, sistema, dispositivo, browser]
            );
            const token = jwt.sign(
                {
                    id: user.IdUsuario,
                    email: user.CorreoElectronico,
                    nombre: user.Nombre,
                    rol: user.IdRole,
                    sesion: sesionActual
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({
                success: true,
                token,
                user: {
                    id: user.IdUsuario,
                    email: user.CorreoElectronico,
                    nombre: user.Nombre,
                    apellido: user.Apellido,
                    rol: user.IdRole,
                    sesion: sesionActual
                }
            });
        } else {
            // Login fallido: incrementar IntentosDeAcceso
            await db.execute(
                'UPDATE USUARIO SET IntentosDeAcceso = IFNULL(IntentosDeAcceso,0) + 1 WHERE IdUsuario = ?',
                [user.IdUsuario]
            );
            // Consultar intentos y máximo permitido
            const [[usuarioActualizado]] = await db.execute('SELECT IntentosDeAcceso, IdSucursal FROM USUARIO WHERE IdUsuario = ?', [user.IdUsuario]);
            const [[empresa]] = await db.execute('SELECT PasswordIntentosAntesDeBloquear FROM EMPRESA e JOIN SUCURSAL s ON e.IdEmpresa = s.IdEmpresa WHERE s.IdSucursal = ?', [usuarioActualizado.IdSucursal]);
            if (usuarioActualizado.IntentosDeAcceso >= empresa.PasswordIntentosAntesDeBloquear) {
                // Cambiar status a bloqueado (IdStatusUsuario = 3)
                await db.execute('UPDATE USUARIO SET IdStatusUsuario = 3 WHERE IdUsuario = ?', [user.IdUsuario]);
                // IdTipoAcceso = 2 (Bloqueado - Password incorrecto/Numero de intentos exedidos)
                const { sistema, dispositivo, browser } = parseUserAgent(userAgent);
                await db.execute(
                    'INSERT INTO BITACORA_ACCESO (IdUsuario, IdTipoAcceso, FechaAcceso, HttpUserAgent, DireccionIp, Accion, Sesion, SistemaOperativo, Dispositivo, Browser) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)',
                    [user.IdUsuario, 2, userAgent, ip, 'Intentos fallidos superados (bloqueado)', user.SesionActual, sistema, dispositivo, browser]
                );
                return res.status(403).json({ error: 'Bloqueado - Password incorrecto/Numero de intentos exedidos. Contacta a un administrador.' });
            }
            // IdTipoAcceso = 2 (Bloqueado - Password incorrecto/Numero de intentos exedidos) para intento fallido pero no bloqueado
            const { sistema, dispositivo, browser } = parseUserAgent(userAgent);
            await db.execute(
                'INSERT INTO BITACORA_ACCESO (IdUsuario, IdTipoAcceso, FechaAcceso, HttpUserAgent, DireccionIp, Accion, Sesion, SistemaOperativo, Dispositivo, Browser) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)',
                [user.IdUsuario, 2, userAgent, ip, 'Intento de login fallido', user.SesionActual, sistema, dispositivo, browser]
            );
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Función MD5 para compatibilidad
function md5(input) {
    const crypto = require('crypto');

app.post('/api/recuperar-password', async (req, res) => {
    const { correo } = req.body;
    console.log('Solicitud de recuperación para:', correo);
    if (!correo) {
        console.log('Correo no proporcionado');
        return res.status(400).json({ error: 'Correo requerido' });
    }
    try {
        // Buscar usuario por correo
        const [usuarios] = await db.execute('SELECT IdUsuario FROM USUARIO WHERE CorreoElectronico = ?', [correo]);
        if (usuarios.length === 0) {
            console.log('Usuario no encontrado para correo:', correo);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario = usuarios[0];
        // Generar token seguro
        const token = crypto.randomBytes(24).toString('hex');
        const tokenFile = path.join(__dirname, 'recuperar.txt');
        console.log('Intentando escribir token en:', tokenFile);
        try {
            fs.writeFileSync(tokenFile, `${correo}|${token}|${Date.now()}`);
            console.log('Archivo recuperar.txt escrito correctamente');
        } catch (fileErr) {
            console.error('Error escribiendo archivo recuperar.txt:', fileErr);
            return res.status(500).json({ error: 'No se pudo escribir el archivo de token' });
        }
        res.json({ mensaje: 'Token generado. Revisa el archivo recuperar.txt', token });
    } catch (err) {
        console.error('Error generando token:', err);
        res.status(500).json({ error: 'Error generando token' });
    }
});

// Endpoint para cambiar contraseña usando token
app.post('/api/reset-password', async (req, res) => {
    const { correo, token, nuevaPassword } = req.body;
    if (!correo || !token || !nuevaPassword) return res.status(400).json({ error: 'Datos incompletos' });
    try {
    const tokenFile = path.join(__dirname, 'recuperar.txt');
        if (!fs.existsSync(tokenFile)) return res.status(400).json({ error: 'No hay token generado' });
        const contenido = fs.readFileSync(tokenFile, 'utf8');
        const [correoGuardado, tokenGuardado, fechaGuardado] = contenido.split('|');
        // Validar correo y token
        if (correo !== correoGuardado || token !== tokenGuardado) {
            return res.status(400).json({ error: 'Token o correo inválido' });
        }
        // Validar expiración (ejemplo: 15 minutos)
        const expiracionMs = 15 * 60 * 1000;
        if (Date.now() - parseInt(fechaGuardado) > expiracionMs) {
            fs.unlinkSync(tokenFile);
            return res.status(400).json({ error: 'Token expirado' });
        }
        // Cambiar contraseña (encriptada)
        const hash = await bcrypt.hash(nuevaPassword, 10);
        await db.execute('UPDATE USUARIO SET Password = ?, RequiereCambiarPassword = 0 WHERE CorreoElectronico = ?', [hash, correo]);
        fs.unlinkSync(tokenFile);
        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
});
    return crypto.createHash('md5').update(input).digest('hex');
}

// Ruta para obtener datos del dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const [usuariosRow] = await db.execute('SELECT COUNT(*) as total FROM USUARIO');
        const [empresasRow] = await db.execute('SELECT COUNT(*) as total FROM EMPRESA');
        const [rolesRow] = await db.execute('SELECT COUNT(*) as total FROM ROLE');

        res.json({
            stats: {
                usuarios: usuariosRow[0].total,
                empresas: empresasRow[0].total,
                roles: rolesRow[0].total
            },
            recentActivity: [
                {
                    tipo_evento: 'login',
                    descripcion: `Usuario ${req.user?.username || 'Sistema'} ha iniciado sesión`,
                    fecha: new Date().toISOString(),
                    sistema: 'Sistema de Seguridad Bravo'
                }
            ]
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.json({
            stats: {
                usuarios: 1,
                empresas: 0,
                roles: 2
            },
            recentActivity: [
                {
                    tipo_evento: 'login',
                    descripcion: `Usuario del sistema ha iniciado sesión`,
                    fecha: new Date().toISOString(),
                    sistema: 'Sistema de Seguridad Bravo'
                }
            ]
        });
    }
});

app.get('/api/health', async (req, res) => {
    try {
        await db.execute('SELECT 1');
        res.json({ status: 'OK', database: 'Connected' });
    } catch (error) {
        res.status(500).json({ status: 'Error', database: 'Disconnected' });
    }
});

// Obtener todos los usuarios

// Obtener todos los usuarios (incluye Fotografia en base64 si existe)
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario, IdGenero, UltimaFechaIngreso, IntentosDeAcceso, SesionActual, UltimaFechaCambioPassword, CorreoElectronico, RequiereCambiarPassword, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion, Fotografia
            FROM USUARIO`);
        const usuarios = rows.map(u => {
            let fotografia = null;
            if (u.Fotografia) {
                fotografia = Buffer.from(u.Fotografia).toString('base64');
            }
            return { ...u, Fotografia: fotografia };
        });
        res.json(usuarios);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener usuario por ID

// Obtener usuario por ID (incluye Fotografia en base64 si existe)
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM USUARIO WHERE IdUsuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario = rows[0];
        let fotografia = null;
        if (usuario.Fotografia) {
            fotografia = Buffer.from(usuario.Fotografia).toString('base64');
        }
        res.json({ ...usuario, Fotografia: fotografia });
    } catch (error) {
        console.error('Error obteniendo usuario por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Crear usuario
app.post('/api/usuarios', async (req, res) => {
    try {
        const {
            IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario, Password, IdGenero, CorreoElectronico, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole
        } = req.body;
        if (!IdUsuario || !Nombre || !Apellido || !FechaNacimiento || !IdStatusUsuario || !Password || !IdGenero || !CorreoElectronico || !IdSucursal || !Pregunta || !Respuesta || !IdRole) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        await db.execute(`
            INSERT INTO USUARIO (
                IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario, Password, IdGenero, CorreoElectronico, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole, FechaCreacion, UsuarioCreacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
        `, [
            IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario, hashedPassword, IdGenero, CorreoElectronico, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole, req.user?.email || 'system'
        ]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            Nombre, Apellido, FechaNacimiento, IdStatusUsuario, Password, IdGenero, CorreoElectronico, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole
        } = req.body;
        let updatePassword = '';
        let params = [Nombre, Apellido, FechaNacimiento, IdStatusUsuario, IdGenero, CorreoElectronico, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole, req.user?.email || 'system', id];
        if (Password) {
            updatePassword = ', Password = ?';
            const hashedPassword = await bcrypt.hash(Password, 10);
            params = [Nombre, Apellido, FechaNacimiento, IdStatusUsuario, IdGenero, CorreoElectronico, TelefonoMovil, IdSucursal, Pregunta, Respuesta, IdRole, hashedPassword, req.user?.email || 'system', id];
        }
        const [result] = await db.execute(`
            UPDATE USUARIO SET
                Nombre = ?,
                Apellido = ?,
                FechaNacimiento = ?,
                IdStatusUsuario = ?,
                IdGenero = ?,
                CorreoElectronico = ?,
                TelefonoMovil = ?,
                IdSucursal = ?,
                Pregunta = ?,
                Respuesta = ?,
                IdRole = ?
                ${updatePassword}
                , FechaModificacion = NOW(), UsuarioModificacion = ?
            WHERE IdUsuario = ?
        `, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// iliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM USUARIO WHERE IdUsuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Rutas para empresas
app.get('/api/empresas', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM EMPRESA ORDER BY Nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo empresas:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/empresas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM EMPRESA WHERE IdEmpresa = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo empresa por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
//guardar nuevas empresas
app.post('/api/empresas', async (req, res) => {
    try {
        const {
            Nombre, Direccion, Nit,
            PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales, PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear, PasswordCantidadNumeros, PasswordCantidadPreguntasValidar,
            UsuarioCreacion
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO EMPRESA (
        Nombre, Direccion, Nit,
        PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales,
        PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear,
        PasswordCantidadNumeros, PasswordCantidadPreguntasValidar, FechaCreacion, UsuarioCreacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
            [
                Nombre, Direccion, Nit,
                PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales,
                PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear,
                PasswordCantidadNumeros, PasswordCantidadPreguntasValidar, UsuarioCreacion || 'system'
            ]
        );

        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creando empresa:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/roles', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM ROLE ORDER BY Nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo roles:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener roles por ID
app.get('/api/roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM ROLE WHERE IdRole = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo rol por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Crear un nuevo rol
app.post('/api/roles', async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: 'El nombre del rol es requerido' });
        }
        const [result] = await db.execute(
            'INSERT INTO ROLE (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            [Nombre, req.user?.email || 'system']
        );
        res.json({ success: true, IdRole: result.insertId });
    } catch (error) {
        console.error('Error creando rol:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar un rol existente
app.put('/api/roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: 'El nombre del rol es requerido' });
        }
        const [result] = await db.execute(
            'UPDATE ROLE SET Nombre = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdRole = ?',
            [Nombre, req.user?.email || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando rol:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar un rol existente
app.delete('/api/roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM ROLE WHERE IdRole = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando rol:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/sucursales', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT s.*, e.Nombre AS EmpresaNombre
            FROM SUCURSAL s
            JOIN EMPRESA e ON s.IdEmpresa = e.IdEmpresa
            ORDER BY s.IdSucursal`);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener una sucursal por ID
app.get('/api/sucursales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(
            `SELECT s.*, e.Nombre AS EmpresaNombre FROM SUCURSAL s JOIN EMPRESA e ON s.IdEmpresa = e.IdEmpresa WHERE s.IdSucursal = ?`,
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo sucursal por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Crear una nueva sucursal
app.post('/api/sucursales', async (req, res) => {
    try {
        const { Nombre, Direccion, IdEmpresa, UsuarioCreacion } = req.body;
        if (!Nombre || !Direccion || !IdEmpresa) {
            return res.status(400).json({ error: 'Nombre, Direccion e IdEmpresa son requeridos' });
        }
        const [result] = await db.execute(
            'INSERT INTO SUCURSAL (Nombre, Direccion, IdEmpresa, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, NOW(), ?)',
            [Nombre, Direccion, IdEmpresa, UsuarioCreacion || 'system']
        );
        res.json({ success: true, IdSucursal: result.insertId });
    } catch (error) {
        console.error('Error creando sucursal:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Actualizar una sucursal existente
app.put('/api/sucursales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, Direccion, IdEmpresa, UsuarioModificacion } = req.body;
        if (!Nombre || !Direccion || !IdEmpresa) {
            return res.status(400).json({ error: 'Nombre, Direccion e IdEmpresa son requeridos' });
        }
        const [result] = await db.execute(
            'UPDATE SUCURSAL SET Nombre = ?, Direccion = ?, IdEmpresa = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdSucursal = ?',
            [Nombre, Direccion, IdEmpresa, UsuarioModificacion || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando sucursal:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar una sucursal existente
app.delete('/api/sucursales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM SUCURSAL WHERE IdSucursal = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando sucursal:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Obtener todas las opciones
app.get('/api/opciones', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT o.IdOpcion, o.Nombre, o.Pagina, o.OrdenMenu, o.FechaCreacion, o.UsuarioCreacion, o.FechaModificacion, o.UsuarioModificacion,
                   o.IdMenu, m.Nombre AS MenuNombre, m.IdModulo, mo.Nombre AS ModuloNombre,
                   o.FechaModificacion, o.UsuarioModificacion
            FROM OPCION o
            JOIN MENU m ON o.IdMenu = m.IdMenu
            JOIN MODULO mo ON m.IdModulo = mo.IdModulo
            ORDER BY mo.OrdenMenu, m.OrdenMenu, o.OrdenMenu
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo opciones:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener una opción por ID
app.get('/api/opciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(`
            SELECT o.IdOpcion, o.Nombre, o.Pagina, o.OrdenMenu, o.FechaCreacion, o.UsuarioCreacion, o.FechaModificacion, o.UsuarioModificacion,
                   o.IdMenu, m.Nombre AS MenuNombre, m.IdModulo, mo.Nombre AS ModuloNombre
            FROM OPCION o
            JOIN MENU m ON o.IdMenu = m.IdMenu
            JOIN MODULO mo ON m.IdModulo = mo.IdModulo
            WHERE o.IdOpcion = ?
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Opción no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo opción por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Crear una nueva opción
app.post('/api/opciones', async (req, res) => {
    try {
        const { Nombre, IdMenu, Pagina, OrdenMenu } = req.body;
        if (!Nombre || !IdMenu || !Pagina || !OrdenMenu) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
        }
        const [result] = await db.execute(
            'INSERT INTO OPCION (Nombre, IdMenu, Pagina, OrdenMenu, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, ?, NOW(), ?)',
            [Nombre, IdMenu, Pagina, OrdenMenu, req.user?.email || 'system']
        );
        res.json({ success: true, IdOpcion: result.insertId });
    } catch (error) {
        console.error('Error creando opción:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.put('/api/opciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, IdMenu, Pagina, OrdenMenu } = req.body;
        if (!Nombre || !IdMenu || !Pagina || !OrdenMenu) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
        }
        const [result] = await db.execute(
            'UPDATE OPCION SET Nombre = ?, IdMenu = ?, Pagina = ?, OrdenMenu = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdOpcion = ?',
            [Nombre, IdMenu, Pagina, OrdenMenu, req.user?.email || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Opción no encontrada' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando opción:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar una opción
app.delete('/api/opciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [asignaciones] = await db.execute('SELECT * FROM ROLE_OPCION WHERE IdOpcion = ?', [id]);
        if (asignaciones.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar: opción asignada a roles' });
        }
        const [result] = await db.execute('DELETE FROM OPCION WHERE IdOpcion = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Opción no encontrada' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando opción:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Rutas para módulos
app.get('/api/modulos', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM MODULO ORDER BY OrdenMenu');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo módulos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Crear un nuevo módulo
app.post('/api/modulos', async (req, res) => {
    try {
        const { Nombre, OrdenMenu } = req.body;
        if (!Nombre || !OrdenMenu) {
            return res.status(400).json({ error: 'Nombre y OrdenMenu son requeridos' });
        }
        const [exist] = await db.execute('SELECT 1 FROM MODULO WHERE Nombre = ?', [Nombre]);
        if (exist.length > 0) {
            return res.status(409).json({ error: 'Ya existe un módulo con ese nombre' });
        }
        const [result] = await db.execute(
            'INSERT INTO MODULO (Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion) VALUES (?, ?, NOW(), ?)',
            [Nombre, OrdenMenu, req.user?.email || 'system']
        );
        res.json({ success: true, IdModulo: result.insertId });
    } catch (error) {
        console.error('Error creando módulo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Actualizar un módulo existente
app.put('/api/modulos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, OrdenMenu } = req.body;
        if (!Nombre || !OrdenMenu) {
            return res.status(400).json({ error: 'Nombre y OrdenMenu son requeridos' });
        }
        const [exist] = await db.execute('SELECT 1 FROM MODULO WHERE Nombre = ? AND IdModulo != ?', [Nombre, id]);
        if (exist.length > 0) {
            return res.status(409).json({ error: 'Ya existe un módulo con ese nombre' });
        }
        const [result] = await db.execute(
            'UPDATE MODULO SET Nombre = ?, OrdenMenu = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdModulo = ?',
            [Nombre, OrdenMenu, req.user?.email || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando módulo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar un módulo existente
app.delete('/api/modulos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [menus] = await db.execute('SELECT 1 FROM MENU WHERE IdModulo = ?', [id]);
        if (menus.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar: módulo con menús asociados' });
        }
        const [result] = await db.execute('DELETE FROM MODULO WHERE IdModulo = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando módulo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/menus', async (req, res) => {
    try {
        const { modulo } = req.query;
        let rows;
        if (modulo) {
            [rows] = await db.execute(`
                SELECT m.*, mo.Nombre AS NombreModulo
                FROM MENU m
                JOIN MODULO mo ON m.IdModulo = mo.IdModulo
                WHERE m.IdModulo = ?
                ORDER BY m.OrdenMenu
            `, [modulo]);
        } else {
            [rows] = await db.execute(`
                SELECT m.*, mo.Nombre AS NombreModulo
                FROM MENU m
                JOIN MODULO mo ON m.IdModulo = mo.IdModulo
                ORDER BY m.OrdenMenu
            `);
        }
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo menús:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/menus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM MENU WHERE IdMenu = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo menú por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/menus', async (req, res) => {
    try {
        const { IdModulo, Nombre, OrdenMenu } = req.body;
        if (!IdModulo || !Nombre || !OrdenMenu) {
            return res.status(400).json({ error: 'IdModulo, Nombre y OrdenMenu son requeridos' });
        }

        const [moduloRows] = await db.execute('SELECT 1 FROM MODULO WHERE IdModulo = ?', [IdModulo]);
        if (!moduloRows || moduloRows.length === 0) {
            return res.status(400).json({ error: 'El módulo especificado no existe' });
        }
        const [exist] = await db.execute('SELECT 1 FROM MENU WHERE Nombre = ? AND IdModulo = ?', [Nombre, IdModulo]);
        if (exist.length > 0) {
            return res.status(409).json({ error: 'Ya existe un menú con ese nombre en el módulo' });
        }
        const [result] = await db.execute(
            'INSERT INTO MENU (IdModulo, Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion) VALUES (?, ?, ?, NOW(), ?)',
            [IdModulo, Nombre, OrdenMenu, req.user?.email || 'system']
        );
        res.json({ success: true, IdMenu: result.insertId });
    } catch (error) {
        console.error('Error creando menú:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.put('/api/menus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { IdModulo, Nombre, OrdenMenu } = req.body;
        if (!IdModulo || !Nombre || !OrdenMenu) {
            return res.status(400).json({ error: 'IdModulo, Nombre y OrdenMenu son requeridos' });
        }
        const [moduloRows] = await db.execute('SELECT * FROM MODULO WHERE IdModulo = ?', [IdModulo]);
        if (!moduloRows || moduloRows.length === 0) {
            return res.status(400).json({ error: 'El módulo especificado no existe' });
        }
        const [exist] = await db.execute('SELECT * FROM MENU WHERE Nombre = ? AND IdModulo = ? AND IdMenu != ?', [Nombre, IdModulo, id]);
        if (exist.length > 0) {
            return res.status(409).json({ error: 'Ya existe un menú con ese nombre en el módulo' });
        }
        const [result] = await db.execute(
            'UPDATE MENU SET IdModulo = ?, Nombre = ?, OrdenMenu = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdMenu = ?',
            [IdModulo, Nombre, OrdenMenu, req.user?.email || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando menú:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.delete('/api/menus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [opciones] = await db.execute('SELECT * FROM OPCION WHERE IdMenu = ?', [id]);
        if (opciones.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar: menú con opciones asociadas' });
        }
        const [result] = await db.execute('DELETE FROM MENU WHERE IdMenu = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando menú:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/modules/*', (req, res, next) => {
    if (!req.user && !req.path.includes('login')) {
        return res.redirect('/login.html');
    }
    next();
});

// Ruta para el dashboard principal
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// Ruta para el login
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});


app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/dashboard.html');
    } else {
        res.redirect('/login.html');
    }
});


app.delete('/api/empresas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM EMPRESA WHERE IdEmpresa = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando empresa:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.put('/api/empresas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            Nombre, Direccion, Nit,
            PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales,
            PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear,
            PasswordCantidadNumeros, PasswordCantidadPreguntasValidar, UsuarioModificacion
        } = req.body;

        const [result] = await db.execute(
            `UPDATE EMPRESA SET
                Nombre = ?,
                Direccion = ?,
                Nit = ?,
                PasswordCantidadMayusculas = ?,
                PasswordCantidadMinusculas = ?,
                PasswordCantidadCaracteresEspeciales = ?,
                PasswordCantidadCaducidadDias = ?,
                PasswordLargo = ?,
                PasswordIntentosAntesDeBloquear = ?,
                PasswordCantidadNumeros = ?,
                PasswordCantidadPreguntasValidar = ?,
                FechaModificacion = NOW(),
                UsuarioModificacion = ?
            WHERE IdEmpresa = ?`,
            [
                Nombre, Direccion, Nit,
                PasswordCantidadMayusculas, PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales,
                PasswordCantidadCaducidadDias, PasswordLargo, PasswordIntentosAntesDeBloquear,
                PasswordCantidadNumeros, PasswordCantidadPreguntasValidar, UsuarioModificacion || 'system', id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando empresa:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Rutas para géneros
app.get('/api/generos', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM GENERO ORDER BY Nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo géneros:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/generos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM GENERO WHERE IdGenero = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Género no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo género por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/generos', async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: 'El nombre del género es requerido' });
        }
        const [result] = await db.execute(
            'INSERT INTO GENERO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            [Nombre, req.user?.email || 'system']
        );
        res.json({ success: true, IdGenero: result.insertId });
    } catch (error) {
        console.error('Error creando género:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.put('/api/generos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: 'El nombre del género es requerido' });
        }
        const [result] = await db.execute(
            'UPDATE GENERO SET Nombre = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdGenero = ?',
            [Nombre, req.user?.email || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Género no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando género:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.delete('/api/generos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM GENERO WHERE IdGenero = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Género no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando género:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Rutas para status usuario
app.get('/api/status-usuario', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM STATUS_USUARIO ORDER BY Nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo status usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/status-usuario/:id', async (req, res) => {
    try {                 
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM STATUS_USUARIO WHERE IdStatusUsuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Status usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo status usuario por ID:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/status-usuario', async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: 'El nombre del status usuario es requerido' });
        }
        const [result] = await db.execute(
            'INSERT INTO STATUS_USUARIO (Nombre, FechaCreacion, UsuarioCreacion) VALUES (?, NOW(), ?)',
            [Nombre, req.user?.email || 'system']
        );
        res.json({ success: true, IdStatusUsuario: result.insertId });
    } catch (error) {
        console.error('Error creando status usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.put('/api/status-usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ error: 'El nombre del status usuario es requerido' });
        }
        const [result] = await db.execute(
            'UPDATE STATUS_USUARIO SET Nombre = ?, FechaModificacion = NOW(), UsuarioModificacion = ? WHERE IdStatusUsuario = ?',
            [Nombre, req.user?.email || 'system', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Status usuario no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando status usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.delete('/api/status-usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM STATUS_USUARIO WHERE IdStatusUsuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Status usuario no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando status usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Manejo de errores para rutas no encontradas
app.use((req, res, next) => {
    if (req.accepts('html')) {
        if (req.user) {
            res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
        } else {
            res.redirect('/login.html');
        }
    } else {
        res.status(404).json({ error: 'Ruta no encontrada' });
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (req.accepts('html')) {
        res.status(500).send('Error interno del servidor');
    } else {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

connectToDatabase();

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`👤 Usuario: manager`);
    console.log(`🔑 Contraseña: manager`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, '../frontend')}`);
});

process.on('SIGINT', async () => {
    if (db) {
        await db.end();
        console.log('Conexión a la base de datos cerrada.');
    }
    process.exit(0);
});