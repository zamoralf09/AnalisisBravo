(INICIO SCRIPT SQL)
/* Etapa 2 */

use ProyectoAnalisis;

drop table if exists DOCUMENTO_PERSONA;
drop table if exists MOVIMIENTO_CUENTA;
drop table if exists SALDO_CUENTA;
drop table if exists PERSONA;
drop table if exists TIPO_MOVIMIENTO_CXC;
drop table if exists TIPO_DOCUMENTO;
drop table if exists ESTADO_CIVIL;
drop table if exists FECHA_ACTIVA;
drop table if exists STATUS_CUENTA;
drop table if exists TIPO_SALDO_CUENTA;

create table ESTADO_CIVIL(
	IdEstadoCivil int not null auto_increment,
	Nombre varchar(50) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdEstadoCivil)
);

insert into ESTADO_CIVIL( Nombre, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion )
values
(
'Casado(a)', now(), 'system', null, null
),
(
'Soltero(a)', now(), 'system', null, null
),
(
'Divorciado(a)', now(), 'system', null, null
),
(
'Viudo(a)', now(), 'system', null, null
),
(
'Union de hecho', now(), 'system', null, null
);

create table TIPO_DOCUMENTO(
	IdTipoDocumento int not null auto_increment,
	Nombre varchar(50) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdTipoDocumento)	
);

insert into TIPO_DOCUMENTO( Nombre, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion )
values
(
	'Documento Personal de Identificacion (DPI)', now(), 'system', null, null
),
(
	'Pasaporte', now(), 'system', null, null
),
(
	'NIT', now(), 'system', null, null
),
(
	'Licencia de Conducir', now(), 'system', null, null
),
(
	'Seguro Social IGSS', now(), 'system', null, null
);

create table PERSONA(
	IdPersona int not null auto_increment,
	Nombre varchar(50) not null,
	Apellido varchar(50) not null,
	FechaNacimiento date not null,
	IdGenero int not null,
	Direccion varchar(100) not null,
	Telefono varchar(50) not null,
	CorreoElectronico varchar(50),
	IdEstadoCivil int not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdPersona),
	foreign key (IdGenero) references GENERO(IdGenero),
	foreign key (IdEstadoCivil) references ESTADO_CIVIL(IdEstadoCivil)
);

INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Ernesto Arturo','Quesada Pineda','1992-11-25',1,'Zona 1, Guatemala, Guatemala','502-53180319','equesada@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Martina Isadora','Navarro García','2000-10-27',2,'Zona 9, Amatitlán, Guatemala','502-19084398','mnavarro@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Marco Miguel','Aguilar Ríos','1972-9-20',1,'Zona 1, Chinautla, Guatemala','502-11480761','maguilar@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Arturo Roberto','Acuña Paredes','1996-2-16',1,'Zona 2, Palencia, Guatemala','502-36510516','aacuña@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Esteban Santiago','Castillo Maldonado','1996-3-2',1,'Zona 1, San José del Golfo, Guatemala','502-70498938','ecastillo@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Marco Ángel','Quesada Vargas','1991-4-9',1,'Zona 8, San José Pinula, Guatemala','502-37050638','mquesada@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Catalina Julia','Núñez Arévalo','1991-3-2',2,'Zona 5, San Raymundo, Guatemala','502-43444178','cnúñez@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Santiago Pedro','Alvarado Rodríguez','1976-1-5',1,'Zona 4, Santa Catarina Pinula, Guatemala','502-98151024','salvarado@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Laura Paola','Pineda Cedeño','2010-8-15',2,'Zona 8, Villa Canales, Guatemala','502-16310841','lpineda@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Julia Antonella','Mora Villalobos','1982-9-2',2,'Zona 8, Villa Nueva, Guatemala','502-82132635','jmora@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Juan Sergio','Pacheco Arias','2004-6-27',1,'Zona 10, Guatemala, Guatemala','502-55628911','jpacheco@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Javier Arturo','García Alpízar','1992-6-24',1,'Zona 6, Amatitlán, Guatemala','502-22178495','jgarcía@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Arturo Mateo','Chacón Paredes','2008-12-31',1,'Zona 6, Chinautla, Guatemala','502-72351395','achacón@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Víctor Leonardo','González Carvajal','1986-7-25',1,'Zona 3, Palencia, Guatemala','502-43451258','vgonzález@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Emilio Alejandro','Lara Zúñiga','1993-12-19',1,'Zona 5, San José del Golfo, Guatemala','502-70991044','elara@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('David Omar','Núñez Duarte','2001-11-20',1,'Zona 4, Villa Canales, Guatemala','502-73567915','dnúñez@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Mario Marco','Zamora Medina','1992-3-16',1,'Zona 5, Villa Nueva, Guatemala','502-37441663','mzamora@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Guadalupe Isadora','Arias Segura','1981-3-14',2,'Zona 6, Guatemala, Guatemala','502-75237203','garias@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Pedro Hugo','Mora Rodríguez','1991-8-31',1,'Zona 8, Chinautla, Guatemala','502-06421115','pmora@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Daniela Renata','Ríos Umaña','1970-6-21',2,'Zona 3, Chuarrancho, Guatemala','502-85180897','dríos@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Santiago David','Paredes Villalobos','1983-3-28',1,'Zona 4, Fraijanes, Guatemala','502-77414408','sparedes@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Lucia Catalina','Reyes Delgado','2006-10-12',2,'Zona 5, Mixco, Guatemala','502-30025579','lreyes@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Paola Celeste','Mora Maldonado','1977-6-11',2,'Zona 10, Palencia, Guatemala','502-24655941','pmora@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sebastián Esteban','Alvarado Duarte','2009-1-21',1,'Zona 7, San José del Golfo, Guatemala','502-57517858','salvarado@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Isadora Isadora','Mora Cordero','1992-6-7',2,'Zona 7, San Pedro Ayampuc, Guatemala','502-58426053','imora@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Alejandro Miguel','Alvarado Vásquez','1972-3-21',1,'Zona 4, San Pedro Sacatepéquez, Guatemala','502-07539461','aalvarado@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Paula Celeste','Arias Arias','1994-7-28',2,'Zona 6, San Raymundo, Guatemala','502-48556222','parias@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Luis Nicolás','Peña Arias','2002-11-1',1,'Zona 6, Santa Catarina Pinula, Guatemala','502-36341511','lpeña@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Emilio Mario','Cedeño Quirós','1983-6-1',1,'Zona 3, Villa Canales, Guatemala','502-05586542','ecedeño@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Elena Natalia','Alpízar Cedeño','1991-11-9',2,'Zona 7, Villa Nueva, Guatemala','502-88627313','ealpízar@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Benjamín Alejandro','Ríos León','2009-7-6',1,'Zona 9, Guatemala, Guatemala','502-06074402','bríos@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Gabriel Luis','Zúñiga González','1993-11-6',1,'Zona 8, Amatitlán, Guatemala','502-53462658','gzúñiga@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Jorge Emilio','Chacón Maldonado','1976-11-13',1,'Zona 5, Chinautla, Guatemala','502-86606837','jchacón@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Beatriz Isadora','Segura Vega','1977-8-23',2,'Zona 1, Mixco, Guatemala','502-98076958','bsegura@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Emilio Sergio','Guzmán Coto','1988-6-5',1,'Zona 9, Palencia, Guatemala','502-65185781','eguzmán@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Javier Héctor','Soto Pérez','1986-5-15',1,'Zona 3, San José del Golfo, Guatemala','502-84759321','jsoto@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Luis Sebastián','Méndez Arias','1982-12-23',1,'Zona 9, San José Pinula, Guatemala','502-47450455','lméndez@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Maria Alejandra','Miranda González','1971-9-19',2,'Zona 1, San Juan Sacatepéquez, Guatemala','502-24682640','mmiranda@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Ángel Ricardo','Bolaños Córdova','1974-7-7',1,'Zona 4, San Pedro Ayampuc, Guatemala','502-47793964','ábolaños@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Francisco Iván','Zamora Bolaños','1981-12-25',1,'Zona 4, San Pedro Sacatepéquez, Guatemala','502-28738818','fzamora@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Santiago Emilio','Bolaños Jara','2001-12-1',1,'Zona 8, San Raymundo, Guatemala','502-22921533','sbolaños@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Martina Elena','Maldonado Soto','1983-6-4',2,'Zona 4, Santa Catarina Pinula, Guatemala','502-85584510','mmaldonado@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sofia Antonella','Castillo Esquivel','1983-7-3',2,'Zona 3, Villa Canales, Guatemala','502-38388355','scastillo@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Romina Alejandra','León López','2010-9-16',2,'Zona 9, Villa Nueva, Guatemala','502-98402323','rleón@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Esteban Santiago','Castro Valverde','1997-3-19',1,'Zona 10, Guatemala, Guatemala','502-59904379','ecastro@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Hugo Ernesto','Castro Maldonado','1996-4-5',1,'Zona 1, Amatitlán, Guatemala','502-09522215','hcastro@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Emilia Valentina','Castro Ríos','1972-3-1',2,'Zona 8, Chinautla, Guatemala','502-49293794','ecastro@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Alejandro Rafael','González Castillo','1985-5-12',1,'Zona 5, Chuarrancho, Guatemala','502-22884221','agonzález@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Emilia Paola','Peña Solano','1997-11-2',2,'Zona 10, Fraijanes, Guatemala','502-39412054','epeña@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Valentina Isadora','Fuentes Aguilar','2001-1-2',2,'Zona 6, Mixco, Guatemala','502-41765628','vfuentes@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Ana Maria','Jiménez Acuña','1989-5-21',2,'Zona 3, Palencia, Guatemala','502-94155250','ajiménez@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Mateo Lucas','Figueroa Vargas','1975-7-10',1,'Zona 4, San José del Golfo, Guatemala','502-97079182','mfigueroa@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Renata Renata','Montero Solano','1994-7-16',2,'Zona 4, San José Pinula, Guatemala','502-75074666','rmontero@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Carlos Roberto','Soto Peña','1973-9-8',1,'Zona 6, San Juan Sacatepéquez, Guatemala','502-84886362','csoto@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Diana Isadora','Barrantes Marín','2001-10-23',2,'Zona 9, San Pedro Ayampuc, Guatemala','502-27123835','dbarrantes@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Natalia Rocio','Bolaños González','1978-3-6',2,'Zona 3, San Pedro Sacatepéquez, Guatemala','502-62835249','nbolaños@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Mario Benjamín','Flores Brenes','1980-8-24',1,'Zona 3, San Raymundo, Guatemala','502-71311219','mflores@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sofia Paula','Solano Ramírez','1982-12-22',2,'Zona 3, Santa Catarina Pinula, Guatemala','502-93185766','ssolano@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Laura Laura','Arias Campos','1980-6-1',2,'Zona 4, Villa Canales, Guatemala','502-23140146','larias@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Natalia Renata','Fernández Umaña','1990-7-18',2,'Zona 8, Villa Nueva, Guatemala','502-64176199','nfernández@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Clara Carolina','Bonilla Rivas','1992-9-6',2,'Zona 1, Guatemala, Guatemala','502-89209226','cbonilla@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Rafael Fernando','Pineda Medina','2007-8-5',1,'Zona 8, Amatitlán, Guatemala','502-77574372','rpineda@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Francisco Alejandro','Arévalo Delgado','1980-4-24',1,'Zona 9, Chinautla, Guatemala','502-04644537','farévalo@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sergio Mario','Montero Alpízar','2008-6-28',1,'Zona 2, Chuarrancho, Guatemala','502-57070513','smontero@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Antonella Andrea','Cruz Valverde','1998-7-10',2,'Zona 5, Fraijanes, Guatemala','502-07258181','acruz@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Esteban Raúl','Pacheco Núñez','1990-10-25',1,'Zona 1, Mixco, Guatemala','502-52682800','epacheco@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Lucas Emilio','Valencia Maldonado','1985-6-28',1,'Zona 4, Palencia, Guatemala','502-59563499','lvalencia@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Emilia Valeria','Segura Benavides','2003-12-1',2,'Zona 6, San José del Golfo, Guatemala','502-60991618','esegura@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Luciana Amanda','Martínez Fuentes','1980-6-10',2,'Zona 1, San José Pinula, Guatemala','502-56710585','lmartínez@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Maria Beatriz','Peña Navarro','1995-3-6',2,'Zona 3, San Juan Sacatepéquez, Guatemala','502-59368137','mpeña@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Adriana Elena','Peña Ríos','1994-8-3',2,'Zona 10, San Pedro Ayampuc, Guatemala','502-31026525','apeña@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Gabriel Javier','López Castro','1979-1-29',1,'Zona 1, San Pedro Sacatepéquez, Guatemala','502-07262832','glópez@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Pedro Sebastián','Araya Maldonado','1997-6-17',1,'Zona 7, San Raymundo, Guatemala','502-63104226','paraya@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Roberto Santiago','Zamora Quirós','2009-1-29',1,'Zona 9, Santa Catarina Pinula, Guatemala','502-87030204','rzamora@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Mateo Roberto','Solano Castro','1973-6-21',1,'Zona 1, Villa Canales, Guatemala','502-12922659','msolano@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Eduardo Héctor','Cordero Ríos','1982-3-17',1,'Zona 4, Villa Nueva, Guatemala','502-40181811','ecordero@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Carlos Diego','Peña Reyes','1991-11-25',1,'Zona 9, Guatemala, Guatemala','502-48412635','cpeña@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Carlos Luis','Castro Torres','2004-2-5',1,'Zona 8, Amatitlán, Guatemala','502-58186306','ccastro@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Isabel Laura','Jara Quirós','1991-5-27',2,'Zona 8, Chinautla, Guatemala','502-38662740','ijara@itcompany.com',1,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Renata Beatriz','López Zamora','1979-11-2',2,'Zona 9, Chuarrancho, Guatemala','502-11849048','rlópez@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Esteban Carlos','Torres Figueroa','1988-3-16',1,'Zona 5, Fraijanes, Guatemala','502-00602000','etorres@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Valentina Maria','Paredes Jiménez','2008-8-22',2,'Zona 7, Mixco, Guatemala','502-60725733','vparedes@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Gabriela Carolina','Bolaños Rivas','1989-3-31',2,'Zona 7, Palencia, Guatemala','502-67590883','gbolaños@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Iván Arturo','Valencia Herrera','1996-3-17',1,'Zona 7, San José del Golfo, Guatemala','502-10344907','ivalencia@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sebastián Ricardo','Zúñiga Solano','1976-12-3',1,'Zona 8, San José Pinula, Guatemala','502-21672231','szúñiga@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Hugo Carlos','Solano Romero','1986-11-12',1,'Zona 7, San Juan Sacatepéquez, Guatemala','502-73481164','hsolano@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Mariana Fernanda','Castro Zamora','1975-12-23',2,'Zona 3, San Pedro Ayampuc, Guatemala','502-54175987','mcastro@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Santiago Luis','Zamora Solano','1992-6-13',1,'Zona 10, San Pedro Sacatepéquez, Guatemala','502-54635987','szamora@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Daniel Antonio','Bonilla Carvajal','2009-5-26',1,'Zona 6, San Raymundo, Guatemala','502-97381960','dbonilla@itcompany.com',3,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Carolina Laura','Acuña Aguilar','1971-6-10',2,'Zona 4, Santa Catarina Pinula, Guatemala','502-75885729','cacuña@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Paola Elena','Bolaños Castro','2000-4-23',2,'Zona 8, Villa Canales, Guatemala','502-33040063','pbolaños@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Paula Rocio','Barrantes Bolaños','1985-6-26',2,'Zona 3, Villa Nueva, Guatemala','502-76613821','pbarrantes@itcompany.com',2,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Maria Martina','Bonilla Zúñiga','2001-4-7',2,'Zona 10, Guatemala, Guatemala','502-91974450','mbonilla@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Isabel Clara','Coto Montero','1984-12-23',2,'Zona 10, Amatitlán, Guatemala','502-02332200','icoto@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Iván Manuel','Arias Villalobos','1973-12-9',1,'Zona 9, Chinautla, Guatemala','502-81644529','iarias@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Roberto Víctor','Chacón Bolaños','1983-9-30',1,'Zona 5, Chuarrancho, Guatemala','502-12456861','rchacón@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Omar Gerardo','León Aguilar','1996-7-3',1,'Zona 5, Fraijanes, Guatemala','502-33161190','oleón@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sofia Isabel','Medina Soto','2008-9-16',2,'Zona 1, Mixco, Guatemala','502-04644225','smedina@itcompany.com',4,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Rocio Ana','Delgado Guzmán','2000-12-18',2,'Zona 4, Palencia, Guatemala','502-36470075','rdelgado@itcompany.com',5,now(),'system');
INSERT INTO PERSONA (Nombre, Apellido, FechaNacimiento, IdGenero, Direccion, Telefono, CorreoElectronico, IdEstadoCivil, FechaCreacion, UsuarioCreacion) VALUES ('Sofia Carolina','Vargas Rivas','2009-2-14',2,'Zona 5, San José del Golfo, Guatemala','502-83724325','svargas@itcompany.com',1,now(),'system');

create table DOCUMENTO_PERSONA(
	IdTipoDocumento int not null,
	IdPersona int not null,
	NoDocumento varchar(50),
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdTipoDocumento,IdPersona),
	foreign key (IdTipoDocumento) references TIPO_DOCUMENTO(IdTipoDocumento),
	foreign key (IdPersona) references PERSONA(IdPersona)
);

INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 1, '9843 55061 4572', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 2, '7075 73013 6224', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 3, '2530 90222 1019', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 4, '6669 63925 5755', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 5, '5049 91259 0100', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 6, '5182 06281 7749', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 7, '8655 54571 6296', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 8, '3865 29405 8011', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 9, '4351 58506 8353', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 10, '8988 72254 1232', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 11, '7132 89673 5304', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 12, '0824 09869 7755', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 13, '9821 00067 9229', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 14, '2121 43389 0471', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 15, '0438 92877 7298', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 16, '1358 70952 6611', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 17, '9470 38126 3709', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 18, '7399 64433 4795', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 19, '5222 43174 1094', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 20, '8654 03199 6046', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 21, '8673 75698 0647', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 22, '8962 51233 9886', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 23, '6174 26133 6105', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 24, '8395 83334 5874', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 25, '0200 96366 9189', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 26, '3225 48797 3525', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 27, '7983 70317 1074', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 28, '1371 28588 4414', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 29, '2168 56399 1848', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 30, '6531 09372 8853', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 31, '1360 91614 7260', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 32, '7620 03824 3602', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 33, '2740 67932 1333', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 34, '9553 98050 7483', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 35, '8328 99392 0862', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 36, '0692 30269 9778', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 37, '3951 20723 4629', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 38, '0842 05539 9738', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 39, '5645 61309 8595', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 40, '7571 04468 3810', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 41, '5093 49946 5770', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 42, '5352 17345 3930', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 43, '6610 55723 0937', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 44, '2593 53764 7338', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 45, '3531 01066 9962', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 46, '7534 16515 2177', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 47, '0251 60275 6931', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 48, '1958 10242 1171', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 49, '9277 24935 8080', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 50, '4303 72545 3163', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 51, '4585 87418 3421', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 52, '1918 23030 7526', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 53, '6962 45458 4230', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 54, '6799 04752 1575', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 55, '9628 94486 0223', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 56, '1531 63081 7902', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 57, '4013 58916 6452', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 58, '7285 58897 0731', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 59, '1516 33095 1121', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 60, '5472 53843 1493', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 61, '4195 12340 2881', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 62, '9646 99733 7207', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 63, '9661 50188 8724', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 64, '9391 39362 5184', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 65, '7533 45552 3134', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 66, '1341 37675 5601', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 67, '8102 29282 1440', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 68, '5808 90184 7851', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 69, '7661 74962 8195', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 70, '6788 24609 7176', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 71, '6897 39562 9346', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 72, '0863 18558 8599', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 73, '6703 11268 1230', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 74, '3665 52079 0291', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 75, '8519 49295 2482', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 76, '2694 09817 3750', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 77, '3219 73844 7773', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 78, '3780 72681 3789', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 79, '3233 13658 7967', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 80, '7850 42187 8510', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 81, '1069 65077 5997', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 82, '0212 93606 9680', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 83, '1460 85833 5143', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 84, '2190 42958 1452', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 85, '1716 62914 0464', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 86, '2400 21782 2284', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 87, '1323 22449 1918', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 88, '7537 97427 4087', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 89, '5776 26535 4892', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 90, '1385 65867 3574', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 91, '3794 04401 3693', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 92, '3396 52419 0967', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 93, '3463 50684 6826', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 94, '7169 79981 3881', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 95, '9178 91826 6931', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 96, '2229 21930 4933', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 97, '2038 51041 2278', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 98, '1951 29958 0337', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 99, '5166 41205 5957', NOW(), 'system');
INSERT INTO DOCUMENTO_PERSONA (IdTipoDocumento, IdPersona, NoDocumento, FechaCreacion, UsuarioCreacion) VALUES (1, 100, '9823 32332 3967', NOW(), 'system');

create table STATUS_CUENTA(
	IdStatusCuenta int not null auto_increment,
	Nombre varchar(50) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdStatusCuenta)	
);

insert into STATUS_CUENTA( Nombre, FechaCreacion, UsuarioCreacion )
values
('Cuenta Activa',now(), 'system'),
('Cuenta Cancelada',now(), 'system'),
('Cuenta en Cobro Juridico',now(), 'system');

create table TIPO_SALDO_CUENTA(
	IdTipoSaldoCuenta int not null auto_increment,
	Nombre varchar(50),
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdTipoSaldoCuenta)
);

insert into TIPO_SALDO_CUENTA(Nombre, FechaCreacion, UsuarioCreacion )
values
( 'Prestamo Personal', now(), 'system' ),
( 'Tarjeta de Credito', now(), 'system' );

create table SALDO_CUENTA(
	IdSaldoCuenta int NOT NULL auto_increment,
	IdPersona int not null,
	IdStatusCuenta int not null,
	IdTipoSaldoCuenta int not null,
	SaldoAnterior decimal(10,2),
	Debitos decimal(10,2),
	Creditos Decimal(10,2),
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdSaldoCuenta),
	foreign key (IdPersona) references PERSONA( IdPersona ),
	foreign key (IdStatusCuenta) references STATUS_CUENTA(IdStatusCuenta),
	foreign key (IdTipoSaldoCuenta) references TIPO_SALDO_CUENTA(IdTipoSaldoCuenta)
);

INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (1,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (2,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (3,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (4,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (5,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (6,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (7,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (8,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (9,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (10,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (11,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (12,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (13,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (14,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (15,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (16,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (17,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (18,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (19,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (20,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (21,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (22,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (23,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (24,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (25,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (26,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (27,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (28,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (29,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (30,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (31,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (32,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (33,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (34,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (35,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (36,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (37,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (38,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (39,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (40,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (41,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (42,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (43,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (44,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (45,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (46,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (47,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (48,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (49,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (50,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (51,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (52,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (53,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (54,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (55,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (56,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (57,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (58,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (59,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (60,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (61,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (62,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (63,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (64,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (65,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (66,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (67,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (68,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (69,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (70,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (71,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (72,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (73,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (74,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (75,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (76,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (77,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (78,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (79,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (80,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (81,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (82,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (83,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (84,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (85,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (86,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (87,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (88,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (89,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (90,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (91,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (92,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (93,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (94,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (95,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (96,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (97,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (98,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (99,1, 1, 0, 0 , 0, NOW(), 'system');
INSERT INTO SALDO_CUENTA (idPersona, IdStatusCuenta, IdTipoSaldoCuenta,  SaldoAnterior, Debitos, Creditos, FechaCreacion, UsuarioCreacion ) VALUES (100,1, 1, 0, 0 , 0, NOW(), 'system');

create table PERIODO_CIERRE_MES(
    Anio int not null,
    Mes int not null,
    FechaInicio date not null,
    FechaFinal date not null,
    FechaCierre datetime,
    primary key (Anio,Mes)
);

insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,6,'2025/6/1','2025/6/30',null);
insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,7,'2025/7/1','2025/7/31',null);
insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,8,'2025/8/1','2025/8/31',null);
insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,9,'2025/9/1','2025/9/30',null);
insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,10,'2025/10/1','2025/10/31',null);
insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,11,'2025/11/1','2025/11/30',null);
insert into PERIODO_CIERRE_MES(Anio,Mes,FechaInicio, FechaFinal,FechaCierre) values(2025,12,'2025/12/1','2025/12/31',null);


create table SALDO_CUENTA_HIST(
	Anio int not null,
	Mes int not null,
	IdSaldoCuenta int NOT NULL,
	IdPersona int not null,
	IdStatusCuenta int not null,
	IdTipoSaldoCuenta int not null,
	SaldoAnterior decimal(10,2),
	Debitos decimal(10,2),
	Creditos Decimal(10,2),
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (Anio,Mes,IdSaldoCuenta),
	foreign key (IdPersona) references PERSONA( IdPersona ),
	foreign key (IdStatusCuenta) references STATUS_CUENTA(IdStatusCuenta),
	foreign key (IdTipoSaldoCuenta) references TIPO_SALDO_CUENTA(IdTipoSaldoCuenta),
	foreign key (Anio,Mes) references PERIODO_CIERRE_MES(Anio,Mes)
);

create table TIPO_MOVIMIENTO_CXC(
	IdTipoMovimientoCXC int not null auto_increment,
	Nombre varchar(75) not null,
	OperacionCuentaCorriente int not null, /* 1 es Sumar en la CXC y 2 es Restar en la CXC */ 
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdTipoMovimientoCXC)
);

/* La operacion de la cuenta corriente es 1=Cargo 2=Abono */

insert into TIPO_MOVIMIENTO_CXC( Nombre, OperacionCuentaCorriente, FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion )
values
(
	'Nota de Debito', 1, now(), 'system', null, null /* IdTipoMovimientoCXC = 1 */
),
(
	'Consumo', 1, now(), 'system', null, null /* IdTipoMovimientoCXC = 2 */
),
(
	'Reversa de Pago', 1, now(), 'system', null, null /* IdTipoMovimientoCXC = 3 */
),
(
	'Cargos por Servicio', 1, now(), 'system', null, null /* IdTipoMovimientoCXC = 4 */
),
(
	'Cargos por Mora', 1, now(), 'system', null, null /* IdTipoMovimientoCXC = 5 */
),
(
	'Intereses Bonificables por consumo', 1, now(), 'system', null, null /* IdTipoMovimientoCXC = 6 */
),
(
	'Nota de Credito', 2, now(), 'system', null, null /* IdTipoMovimientoCXC = 7 */
),
(
	'Pago Recibido', 2, now(), 'system', null, null /* IdTipoMovimientoCXC = 8 */
),
(
	'Reversa de Consumo', 2, now(), 'system', null, null /* IdTipoMovimientoCXC = 9 */
);

create table MOVIMIENTO_CUENTA(
	IdMovimientoCuenta int not null auto_increment,
	IdSaldoCuenta int not null,
	IdTipoMovimientoCXC int not null,
	FechaMovimiento datetime not null,
	ValorMovimiento decimal(10,2) not null,
	ValorMovimientoPagado decimal(10,2) not null,
	GeneradoAutomaticamente boolean not null,
	Descripcion varchar(75) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdMovimientoCuenta),
	foreign key (IdSaldoCuenta) references SALDO_CUENTA( IdSaldoCuenta ),
	foreign key (IdTipoMovimientoCXC) references TIPO_MOVIMIENTO_CXC( IdTipoMovimientoCXC )
);

INSERT INTO MODULO (
    Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion 
)
VALUES
(
    'Cuenta Corriente Por Cobrar', 2, NOW(), 'system'
);

INSERT INTO MENU (
    IdModulo, Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion 
)
VALUES
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

INSERT INTO OPCION (
    IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion 
)
VALUES
(
    5, 'Status de Cuentas', 1, 'status_cuenta.php', NOW(), 'system' /*   IdOpcion = 11  */
),
(
    5, 'Estado Civil de Personas', 2, 'estado_civil.php', NOW(), 'system' /*   IdOpcion = 12  */
),
(
    5, 'Tipos de Documentos', 3, 'tipos_documento.php', NOW(), 'system'  /*   IdOpcion = 13  */
),
(
    5, 'Tipos de Movimientos Cuenta Corriente', 4, 'tipo_movimiento_cxc.php', NOW(), 'system'  /*   IdOpcion = 14  */
),
(
    6, 'Tipos de Cuentas', 5, 'tipo_saldo_cuenta.php', NOW(), 'system'  /*   IdOpcion = 15  */
),
(
    6, 'Gestion de Personas', 6, 'persona.php', NOW(), 'system'   /*   IdOpcion = 16  */
),
(
    6, 'Gestion de Cuentas', 7, 'saldo_cuenta.php', NOW(), 'system'   /*   IdOpcion = 17  */
),
(
    6, 'Consulta de Saldos', 8, 'consulta_saldo.php', NOW(), 'system'   /*   IdOpcion = 18  */
),
(
    7, 'Estado de Cuenta', 9, 'estado_cuenta.php', NOW(), 'system'   /*   IdOpcion = 19  */
),
(
    8, 'Grabacion de Movimientos', 10, 'grabacion_movimientos.php', NOW(), 'system'   /*   IdOpcion = 20  */
),
(
    8, 'Cierre de Mes', 11, 'cierre_mes.php', NOW(), 'system'   /*   IdOpcion = 21  */
);

insert into role_opcion (IdRole, IdOpcion, Alta, Baja, Cambio, Imprimir, Exportar, FechaCreacion, UsuarioCreacion )
values
(1,11,true,true,true,true,true,now(),'system'),
(1,12,true,true,true,true,true,now(),'system'),
(1,13,true,true,true,true,true,now(),'system'),
(1,14,true,true,true,true,true,now(),'system'),
(1,15,true,true,true,true,true,now(),'system'),
(1,16,true,true,true,true,true,now(),'system'),
(1,17,true,true,true,true,true,now(),'system'),
(1,18,true,true,true,true,true,now(),'system'),
(1,19,true,true,true,true,true,now(),'system'),
(1,20,true,true,true,true,true,now(),'system'),
(1,21,true,true,true,true,true,now(),'system');

select m.idmodulo, m.Nombre, me.IdMenu, me.Nombre, o.IdOpcion, o.Nombre, o.Pagina 
  from modulo as m inner join menu as me on m.IdModulo = me.IdModulo inner join opcion o on o.IdMenu = me.IdMenu;
 

(FIN SCRIPT SQL)