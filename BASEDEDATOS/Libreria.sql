
DROP DATABASE IF EXISTS test_libreria;
CREATE DATABASE test_libreria;
USE test_libreria;


CREATE TABLE Libros (
  ID             int(10) NOT NULL AUTO_INCREMENT, 
  Titulo         varchar(255) NOT NULL, 
  TituloOriginal varchar(255), 
  ISBN           int(10) NOT NULL, 
  Numero_pag     int(100) NOT NULL, 
  Dimensiones    varchar(100) NOT NULL, 
  Descripcion    varchar(255) NOT NULL, 
  editorial_id   int(10) NOT NULL, 
  created_at     timestamp NOT NULL, 
  updated_at     timestamp NOT NULL, 
  genero_id      int(10) NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Proveedores (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  Nombre     varchar(255) NOT NULL, 
  Direccion  varchar(255) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Lotes (
  ID            int(10) NOT NULL AUTO_INCREMENT, 
  Descripcion   varchar(50) NOT NULL, 
  Fecha_Entrega date NOT NULL, 
  proveedor_id  int(10) NOT NULL, 
  created_at    timestamp NOT NULL, 
  updated_at    timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Ejemplares (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  Cantidad   int(100) NOT NULL, 
  precio     int(10) NOT NULL, 
  libro_id   int(10) NOT NULL, 
  lote_id    int(10) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Empleados (
  ID             int(10) NOT NULL AUTO_INCREMENT, 
  Nombres        varchar(255) NOT NULL, 
  Apellidos      varchar(255) NOT NULL, 
  CURP           varchar(255) NOT NULL, 
  RFC            varchar(255) NOT NULL, 
  nombre_trabajo varchar(255) NOT NULL, 
  Fecha_Nac      date NOT NULL, 
  fechacontrat   date NOT NULL, 
  direccion_id   int(10) NOT NULL, 
  manager_id     int(10) NOT NULL, 
  created_at     timestamp NOT NULL, 
  updated_at     timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Registros (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  empleados_id int(10) NOT NULL, 
  dia_llegada  date NOT NULL, 
  hora_llegada time NOT NULL, 
  dia_ida      date NOT NULL, 
  hora_ida     time NOT NULL, 
  horas        int(4) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Horarios (
  ID                int(10) NOT NULL AUTO_INCREMENT, 
  Turno_Hora_Inicio time(6) NOT NULL, 
  Turno_Hora_Fin    time(6) NOT NULL, 
  FechaDesde        date NOT NULL, 
  FechaHasta        date NOT NULL, 
  empleados_id      int(10) NOT NULL, 
  created_at        timestamp NOT NULL, 
  updated_at        timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Usuarios (
  ID               int(10) NOT NULL AUTO_INCREMENT, 
  Nombre           varchar(255) NOT NULL, 
  Apellidos        varchar(255) NOT NULL, 
  EMail            varchar(255) NOT NULL, 
  NombreUsuario    varchar(255) NOT NULL, 
  Contraseña       varchar(255) NOT NULL, 
  Tipo_Inicio      varchar(255) NOT NULL, 
  Fecha_Nacimiento date NOT NULL, 
  direccion_id     int(10) NOT NULL, 
  created_at       timestamp NOT NULL, 
  updated_at       timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Direcciones (
  ID          int(10) NOT NULL AUTO_INCREMENT, 
  Calle       varchar(255) NOT NULL, 
  Numero      int(11) NOT NULL, 
  Colonia     varchar(255) NOT NULL, 
  Ciudad      varchar(255) NOT NULL, 
  Pais        varchar(255) NOT NULL, 
  Descripcion varchar(255) NOT NULL, 
  created_at  timestamp NOT NULL, 
  updated_at  timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Compras (
  ID                   int(10) NOT NULL AUTO_INCREMENT, 
  Unidades_de_producto int(11) NOT NULL, 
  Estampa_tiempo       timestamp NOT NULL, 
  VerificacionDePago   bit(1) NOT NULL, 
  FormaDePago          varchar(255) NOT NULL, 
  EstadoDeCompra       varchar(255) NOT NULL, 
  Usuario_id           int(10) NOT NULL, 
  Ejemplar_id          int(10) NOT NULL, 
  Direccion_id         int(10) NOT NULL, 
  Empleado_id          int(10) NOT NULL, 
  created_at           timestamp NOT NULL, 
  updated_at           timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Imagen_libro (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  data         blob NOT NULL, 
  img_filename int(11) NOT NULL, 
  fecha        timestamp NOT NULL, 
  libro_id     int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Editoriales (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  Nombre_ed  varchar(50) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Autores (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  Nombre     varchar(50) NOT NULL, 
  fecnac     date NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Autor_Libro (
  autor_id   int(10) NOT NULL, 
  libro_id   int(10) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NOT NULL, 
  PRIMARY KEY (autor_id, 
  libro_id));
CREATE TABLE Salarios (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  salario      double NOT NULL, 
  fecha_inicio date NOT NULL, 
  fecha_fin    date NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NOT NULL, 
  empleado_id  int(10) NOT NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Generos (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  gen_nombre varchar(50), 
  PRIMARY KEY (ID));
ALTER TABLE Lotes ADD CONSTRAINT FKLotes561248 FOREIGN KEY (proveedor_id) REFERENCES Proveedores (ID);
ALTER TABLE Registros ADD CONSTRAINT FKRegistros775435 FOREIGN KEY (empleados_id) REFERENCES Empleados (ID);
ALTER TABLE Horarios ADD CONSTRAINT FKHorarios642878 FOREIGN KEY (empleados_id) REFERENCES Empleados (ID);
ALTER TABLE Usuarios ADD CONSTRAINT FKUsuarios149099 FOREIGN KEY (direccion_id) REFERENCES Direcciones (ID);
ALTER TABLE Compras ADD CONSTRAINT FKCompras16141 FOREIGN KEY (Usuario_id) REFERENCES Usuarios (ID);
ALTER TABLE Compras ADD CONSTRAINT FKCompras581268 FOREIGN KEY (Ejemplar_id) REFERENCES Ejemplares (ID);
ALTER TABLE Compras ADD CONSTRAINT FKCompras902862 FOREIGN KEY (Direccion_id) REFERENCES Direcciones (ID);
ALTER TABLE Imagen_libro ADD CONSTRAINT FKImagen_lib424853 FOREIGN KEY (libro_id) REFERENCES Libros (ID);
ALTER TABLE Libros ADD CONSTRAINT FKLibros341537 FOREIGN KEY (editorial_id) REFERENCES Editoriales (ID);
ALTER TABLE Autor_Libro ADD CONSTRAINT FKAutor_Libr490576 FOREIGN KEY (autor_id) REFERENCES Autores (ID);
ALTER TABLE Autor_Libro ADD CONSTRAINT FKAutor_Libr726961 FOREIGN KEY (libro_id) REFERENCES Libros (ID);
ALTER TABLE Compras ADD CONSTRAINT FKCompras188433 FOREIGN KEY (Empleado_id) REFERENCES Empleados (ID);
ALTER TABLE Ejemplares ADD CONSTRAINT FKEjemplares625788 FOREIGN KEY (libro_id) REFERENCES Libros (ID);
ALTER TABLE Ejemplares ADD CONSTRAINT FKEjemplares268921 FOREIGN KEY (lote_id) REFERENCES Lotes (ID);
ALTER TABLE Empleados ADD CONSTRAINT FKEmpleados703560 FOREIGN KEY (direccion_id) REFERENCES Direcciones (ID);
ALTER TABLE Empleados ADD CONSTRAINT FKEmpleados97550 FOREIGN KEY (manager_id) REFERENCES Empleados (ID);
ALTER TABLE Salarios ADD CONSTRAINT FKSalarios924434 FOREIGN KEY (empleado_id) REFERENCES Empleados (ID);
ALTER TABLE Libros ADD CONSTRAINT FKLibros529235 FOREIGN KEY (genero_id) REFERENCES Generos (ID);



INSERT INTO Editoriales(Nombre_ed) VALUES ('NoBooks');
INSERT INTO Editoriales(Nombre_ed) VALUES ('Gnome Press');

INSERT INTO Autores(Nombre, fecnac) VALUES ('Herman Melville', '1819-08-01'), 
										 ('Isaac Asimov', '1920-01-02');
										 
INSERT INTO generos(gen_nombre) VALUES ('Novela'), ('Ciencia Ficcion');

INSERT INTO Libros(Titulo, TituloOriginal, ISBN, Numero_pag, Dimensiones, Descripcion, editorial_id, genero_id)
VALUES ('Moby-Dick', 'Moby-Dick', 9787532226320, 581, 'No.id', 
'Narra la travesía del barco ballenero Pequod, comandado por el capitán Ahab, junto a Ismael y el arponero Quiqueg en la obsesiva y autodestructiva persecución de un gran cachalote blanco.', 
1, 1),
('Yo, robot', 'I Robot', 9780007491513, 374, 'No.id', 
'Yo, robot es una colección de relatos en los que se establecen y plantean los problemas de las tres leyes de la robótica que son un compendio fijo e imprescindible de moral aplicable a supuestos robots inteligentes.', 
2, 2);
-- select lib.titulo, ed.nombre_ed from libro AS lib inner join editorial AS ed ON (lib.editorial_id = ed.id);

INSERT INTO Autor_Libro(autor_id, libro_id) VALUES (1, 1), (2, 2);

-- SELECT lib.Titulo, aut.Nombre, ed.Nombre_ed FROM libro AS lib INNER JOIN autor_libro AS alib ON (lib.id = alib.libro_id) INNER JOIN Autor AS aut ON(aut.id = alib.autor_id) INNER JOIN editorial AS ed ON (lib.editorial_id = ed.id)


