DROP DATABASE IF EXISTS test_libreria;
CREATE DATABASE test_libreria;
USE test_libreria;

CREATE TABLE Libros (
  ID                 int(10) NOT NULL AUTO_INCREMENT, 
  titulo             varchar(255) NOT NULL, 
  orig_titulo        varchar(255), 
  isbn               bigint(15) NOT NULL, 
  paginas            int(10) NOT NULL, 
  descripcion_fisica varchar(100) NOT NULL, 
  descripcion        varchar(255) NOT NULL, 
  genero_id          int(10) NOT NULL, 
  editorial_id       int(10) NOT NULL, 
  created_at         timestamp NOT NULL, 
  updated_at         timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Proveedores (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  nombre       varchar(255) NOT NULL, 
  email        varchar(50) NOT NULL, 
  direccion_id int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Lotes (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  descripcion  varchar(50) NOT NULL, 
  fentrega     date NOT NULL, 
  proveedor_id int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Ejemplares (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  cantidad   int(100) NOT NULL, 
  precio     int(10) NOT NULL, 
  libro_id   int(10) NOT NULL, 
  lote_id    int(10) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Empleados (
  ID             int(10) NOT NULL AUTO_INCREMENT, 
  nombres        varchar(255) NOT NULL, 
  apellidos      varchar(255) NOT NULL, 
  RFC            varchar(255) NOT NULL, 
  nombre_trabajo varchar(255) NOT NULL, 
  Fecha_Nac      date NOT NULL, 
  fechacontrat   date NOT NULL, 
  direccion_id   int(10) NOT NULL, 
  manager_id     int(10) NOT NULL, 
  created_at     timestamp NOT NULL, 
  updated_at     timestamp NULL, 
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
  updated_at   timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Horarios (
  ID                int(10) NOT NULL AUTO_INCREMENT, 
  Turno_Hora_Inicio time(6) NOT NULL, 
  Turno_Hora_Fin    time(6) NOT NULL, 
  FechaDesde        date NOT NULL, 
  FechaHasta        date NOT NULL, 
  empleados_id      int(10) NOT NULL, 
  created_at        timestamp NOT NULL, 
  updated_at        timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Usuarios (
  ID               int(10) NOT NULL AUTO_INCREMENT, 
  nombre           varchar(255) NOT NULL, 
  apellidos        varchar(255) NOT NULL, 
  admin            bit(1), 
  email            varchar(255) NOT NULL, 
  username         varchar(255) NOT NULL, 
  password         varchar(255) NOT NULL, 
  Tipo_Inicio      varchar(255) NOT NULL, 
  Fecha_Nacimiento date NOT NULL, 
  direccion_id     int(10) NOT NULL, 
  created_at       timestamp NOT NULL, 
  updated_at       timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Direcciones (
  ID          int(10) NOT NULL AUTO_INCREMENT, 
  calle       varchar(255) NOT NULL, 
  numero      int(11) NOT NULL, 
  colonia     varchar(255) NOT NULL, 
  ciudad      varchar(255) NOT NULL, 
  pais        varchar(255) NOT NULL, 
  descripcion varchar(255) NOT NULL, 
  created_at  timestamp NOT NULL, 
  updated_at  timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Compras (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  verificacion bit(1) NOT NULL, 
  forma_pago   varchar(255) NOT NULL, 
  metodo_pago  varchar(50) NOT NULL, 
  estado       varchar(255) NOT NULL, 
  usuario_id   int(10) NOT NULL, 
  empleado_id  int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Imagen_libro (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  data         blob NOT NULL, 
  img_filename int(11) NOT NULL, 
  fecha        timestamp NOT NULL, 
  libro_id     int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Editoriales (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  nombre_ed  varchar(50) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Autores (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  nombre     varchar(50) NOT NULL, 
  fecnac     date NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Autor_Libro (
  ID         int(10) NOT NULL, 
  autor_id   int(10) NOT NULL, 
  libro_id   int(10) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (ID, 
  autor_id, 
  libro_id));
CREATE TABLE Salarios (
  ID           int(10) NOT NULL AUTO_INCREMENT, 
  salario      double NOT NULL, 
  fecha_inicio date NOT NULL, 
  fecha_fin    date NOT NULL, 
  empleado_id  int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Generos (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  gen_nombre varchar(50) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Item_compra (
  ID                   int(10) NOT NULL AUTO_INCREMENT, 
  item_compra_cantidad int(11) NOT NULL, 
  item_compra_precio   int(11) NOT NULL, 
  ejemplares_id        int(10) NOT NULL, 
  compras_id           int(10) NOT NULL, 
  created_at           timestamp NOT NULL, 
  updated_at           timestamp NULL, 
  PRIMARY KEY (ID));
CREATE TABLE Transporte (
  ID                 int(10) NOT NULL AUTO_INCREMENT, 
  envio_numero_track varchar(30), 
  created_at         timestamp NULL, 
  updated_at         timestamp NULL, 
  compras_id         int(10) NOT NULL, 
  PRIMARY KEY (ID));
ALTER TABLE Lotes ADD CONSTRAINT FKLotes561248 FOREIGN KEY (proveedor_id) REFERENCES Proveedores (ID);
ALTER TABLE Registros ADD CONSTRAINT FKRegistros775435 FOREIGN KEY (empleados_id) REFERENCES Empleados (ID);
ALTER TABLE Horarios ADD CONSTRAINT FKHorarios642878 FOREIGN KEY (empleados_id) REFERENCES Empleados (ID);
ALTER TABLE Usuarios ADD CONSTRAINT FKUsuarios149099 FOREIGN KEY (direccion_id) REFERENCES Direcciones (ID);
ALTER TABLE Compras ADD CONSTRAINT FKCompras488592 FOREIGN KEY (usuario_id) REFERENCES Usuarios (ID);
ALTER TABLE Imagen_libro ADD CONSTRAINT FKImagen_lib424853 FOREIGN KEY (libro_id) REFERENCES Libros (ID);
ALTER TABLE Libros ADD CONSTRAINT FKLibros341537 FOREIGN KEY (editorial_id) REFERENCES Editoriales (ID);
ALTER TABLE Autor_Libro ADD CONSTRAINT FKAutor_Libr490576 FOREIGN KEY (autor_id) REFERENCES Autores (ID);
ALTER TABLE Autor_Libro ADD CONSTRAINT FKAutor_Libr726961 FOREIGN KEY (libro_id) REFERENCES Libros (ID);
ALTER TABLE Compras ADD CONSTRAINT FKCompras681874 FOREIGN KEY (empleado_id) REFERENCES Empleados (ID);
ALTER TABLE Ejemplares ADD CONSTRAINT FKEjemplares625788 FOREIGN KEY (libro_id) REFERENCES Libros (ID);
ALTER TABLE Ejemplares ADD CONSTRAINT FKEjemplares268921 FOREIGN KEY (lote_id) REFERENCES Lotes (ID);
ALTER TABLE Empleados ADD CONSTRAINT FKEmpleados703560 FOREIGN KEY (direccion_id) REFERENCES Direcciones (ID);
ALTER TABLE Empleados ADD CONSTRAINT FKEmpleados97550 FOREIGN KEY (manager_id) REFERENCES Empleados (ID);
ALTER TABLE Salarios ADD CONSTRAINT FKSalarios924434 FOREIGN KEY (empleado_id) REFERENCES Empleados (ID);
ALTER TABLE Libros ADD CONSTRAINT FKLibros288894 FOREIGN KEY (genero_id) REFERENCES Generos (ID);
ALTER TABLE Proveedores ADD CONSTRAINT FKProveedore382979 FOREIGN KEY (direccion_id) REFERENCES Direcciones (ID);
ALTER TABLE Item_compra ADD CONSTRAINT FKItem_compr750443 FOREIGN KEY (ejemplares_id) REFERENCES Ejemplares (ID);
ALTER TABLE Item_compra ADD CONSTRAINT FKItem_compr18095 FOREIGN KEY (compras_id) REFERENCES Compras (ID);
ALTER TABLE Transporte ADD CONSTRAINT FKTransporte344992 FOREIGN KEY (compras_id) REFERENCES Compras (ID);



INSERT INTO Editoriales(nombre_ed) VALUES ('NoBooks');
INSERT INTO Editoriales(nombre_ed) VALUES ('Gnome Press');

INSERT INTO Autores(nombre, fecnac) VALUES ('Herman Melville', '1819-08-01'), 
										 ('Isaac Asimov', '1920-01-02');
										 
INSERT INTO generos(gen_nombre) VALUES ('Novela'), ('Ciencia Ficcion');

INSERT INTO 
Libros(titulo, orig_titulo, isbn, paginas, descripcion_fisica, descripcion, editorial_id, genero_id)
VALUES ('Moby-Dick', 'Moby-Dick', 9787532226320, 581, 'Bolsillo', 
'Narra la travesía del barco ballenero Pequod, 
comandado por el capitán Ahab, junto a Ismael y el 
arponero Quiqueg en la obsesiva y autodestructiva 
persecución de un gran cachalote blanco.', 
1, 1),

('Yo, robot', 'I Robot', 9780007491513, 374, 'No.id', 
'Yo, robot es una colección de relatos en los que se 
establecen y plantean los problemas de las tres leyes 
de la robótica que son un compendio fijo e imprescindible 
de moral aplicable a supuestos robots inteligentes.', 
2, 2);

-- select lib.titulo, ed.nombre_ed from libro AS lib inner join editorial AS ed ON (lib.editorial_id = ed.id);

INSERT INTO Autor_Libro(autor_id, libro_id) VALUES (1, 1), (2, 2);

-- SELECT lib.Titulo, aut.Nombre, ed.Nombre_ed FROM libro AS lib INNER JOIN autor_libro AS alib ON (lib.id = alib.libro_id) INNER JOIN Autor AS aut ON(aut.id = alib.autor_id) INNER JOIN editorial AS ed ON (lib.editorial_id = ed.id)
