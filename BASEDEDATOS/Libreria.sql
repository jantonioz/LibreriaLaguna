DROP DATABASE IF EXISTS test_libreria;
CREATE DATABASE test_libreria;
USE test_libreria;


CREATE TABLE Libros (
  lib_id             int(10) NOT NULL AUTO_INCREMENT, 
  titulo             varchar(255) NOT NULL, 
  orig_titulo        varchar(255), 
  isbn               bigint(15) NOT NULL UNIQUE, 
  paginas            int(10) NOT NULL, 
  descripcion_fisica varchar(100) NOT NULL, 
  descripcion        varchar(255) NOT NULL, 
  genero_id          int(10) NOT NULL, 
  editorial_id       int(10) NOT NULL, 
  created_at         timestamp NOT NULL, 
  updated_at         timestamp NULL, 
  PRIMARY KEY (lib_id));
CREATE TABLE Proveedores (
  prov_id      int(10) NOT NULL AUTO_INCREMENT, 
  prov_nombre  varchar(255) NOT NULL, 
  prov_email   varchar(50) NOT NULL, 
  direccion_id int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (prov_id));
CREATE TABLE Lotes (
  lot_id       int(10) NOT NULL AUTO_INCREMENT, 
  descripcion  varchar(50) NOT NULL, 
  fentrega     date NOT NULL, 
  proveedor_id int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (lot_id));
CREATE TABLE Ejemplares (
  ejem_id       int(10) NOT NULL AUTO_INCREMENT, 
  ejem_cantidad int(100) NOT NULL, 
  ejem_precio   int(10) NOT NULL, 
  libro_id      int(10) NOT NULL, 
  lote_id       int(10) NOT NULL, 
  created_at    timestamp NOT NULL, 
  updated_at    timestamp NULL, 
  PRIMARY KEY (ejem_id));
CREATE TABLE Empleados (
  emp_id        int(10) NOT NULL AUTO_INCREMENT, 
  emp_nombres   varchar(255) NOT NULL, 
  emp_apellidos varchar(255) NOT NULL, 
  emp_RFC       varchar(255) NOT NULL, 
  emp_trabajo   varchar(255) NOT NULL, 
  emp_fnac      date NOT NULL, 
  emp_fcontrat  date NOT NULL, 
  direccion_id  int(10) NOT NULL, 
  manager_id    int(10) NOT NULL, 
  created_at    timestamp NOT NULL, 
  updated_at    timestamp NULL, 
  PRIMARY KEY (emp_id));
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
  hor_id            int(10) NOT NULL AUTO_INCREMENT, 
  Turno_Hora_Inicio time(6) NOT NULL, 
  Turno_Hora_Fin    time(6) NOT NULL, 
  FechaDesde        date NOT NULL, 
  FechaHasta        date NOT NULL, 
  empleados_id      int(10) NOT NULL, 
  created_at        timestamp NOT NULL, 
  updated_at        timestamp NULL, 
  PRIMARY KEY (hor_id));
CREATE TABLE Usuarios (
  usr_id         int(10) NOT NULL AUTO_INCREMENT, 
  usr_nombre     varchar(50) NOT NULL, 
  usr_apellidos  varchar(50) NOT NULL, 
  usr_admin      bit(1), 
  usr_email      varchar(50) NOT NULL UNIQUE, 
  usr_username   varchar(50) NOT NULL UNIQUE, 
  usr_password   varchar(255) NOT NULL, 
  usr_TipoInicio varchar(255) NOT NULL, 
  usr_fnac       date NOT NULL, 
  direccion_id   int(10) NOT NULL, 
  created_at     timestamp NOT NULL, 
  updated_at     timestamp NULL, 
  PRIMARY KEY (usr_id));
CREATE TABLE Direcciones (
  dir_id      int(10) NOT NULL AUTO_INCREMENT, 
  dir_calle   varchar(255) NOT NULL, 
  dir_num     int(11) NOT NULL, 
  dir_colonia varchar(50) NOT NULL, 
  dir_cd      varchar(50) NOT NULL, 
  dir_pais    varchar(50) NOT NULL, 
  created_at  timestamp NOT NULL, 
  updated_at  timestamp NULL, 
  PRIMARY KEY (dir_id));
CREATE TABLE Compras (
  comp_id     int(10) NOT NULL AUTO_INCREMENT, 
  comp_verif  bit(1) NOT NULL, 
  comp_fpago  varchar(255) NOT NULL, 
  comp_mpago  varchar(50) NOT NULL, 
  com_estado  varchar(255) NOT NULL, 
  usuario_id  int(10) NOT NULL, 
  empleado_id int(10) NOT NULL, 
  created_at  timestamp NOT NULL, 
  updated_at  timestamp NULL, 
  PRIMARY KEY (comp_id));
CREATE TABLE Imagen_libro (
  img_id       int(10) NOT NULL AUTO_INCREMENT, 
  data         blob NOT NULL, 
  img_filename varchar(50) NOT NULL, 
  libro_id     int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (img_id));
CREATE TABLE Editoriales (
  ed_id      int(10) NOT NULL AUTO_INCREMENT, 
  ed_nombre  varchar(50) NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (ed_id));
CREATE TABLE Autores (
  aut_id     int(10) NOT NULL AUTO_INCREMENT, 
  aut_nombre varchar(50) NOT NULL, 
  aut_fecnac date NOT NULL, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (aut_id));
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
  sal_id       int(10) NOT NULL AUTO_INCREMENT, 
  salario      double NOT NULL, 
  fecha_inicio date NOT NULL, 
  fecha_fin    date NOT NULL, 
  empleado_id  int(10) NOT NULL, 
  created_at   timestamp NOT NULL, 
  updated_at   timestamp NULL, 
  PRIMARY KEY (sal_id));
CREATE TABLE Generos (
  gen_id     int(10) NOT NULL AUTO_INCREMENT, 
  gen_nombre varchar(50) NOT NULL UNIQUE, 
  created_at timestamp NOT NULL, 
  updated_at timestamp NULL, 
  PRIMARY KEY (gen_id));
CREATE TABLE Item_compra (
  item_id       int(10) NOT NULL AUTO_INCREMENT, 
  item_cantidad int(11) NOT NULL, 
  item_preciou  int(11) NOT NULL, 
  ejemplares_id int(10) NOT NULL, 
  compras_id    int(10) NOT NULL, 
  created_at    timestamp NOT NULL, 
  updated_at    timestamp NULL, 
  PRIMARY KEY (item_id));
CREATE TABLE Transporte (
  trans_id           int(10) NOT NULL AUTO_INCREMENT, 
  envio_numero_track varchar(30), 
  created_at         timestamp NULL, 
  updated_at         timestamp NULL, 
  compras_id         int(10) NOT NULL, 
  PRIMARY KEY (trans_id));
ALTER TABLE Lotes ADD CONSTRAINT FKLotes448903 FOREIGN KEY (proveedor_id) REFERENCES Proveedores (prov_id);
ALTER TABLE Registros ADD CONSTRAINT FKRegistros556208 FOREIGN KEY (empleados_id) REFERENCES Empleados (emp_id);
ALTER TABLE Horarios ADD CONSTRAINT FKHorarios997067 FOREIGN KEY (empleados_id) REFERENCES Empleados (emp_id);
ALTER TABLE Usuarios ADD CONSTRAINT FKUsuarios227162 FOREIGN KEY (direccion_id) REFERENCES Direcciones (dir_id);
ALTER TABLE Compras ADD CONSTRAINT FKCompras824535 FOREIGN KEY (usuario_id) REFERENCES Usuarios (usr_id);
ALTER TABLE Imagen_libro ADD CONSTRAINT FKImagen_lib463402 FOREIGN KEY (libro_id) REFERENCES Libros (lib_id);
ALTER TABLE Libros ADD CONSTRAINT FKLibros994400 FOREIGN KEY (editorial_id) REFERENCES Editoriales (ed_id);
ALTER TABLE Autor_Libro ADD CONSTRAINT FKAutor_Libr149553 FOREIGN KEY (autor_id) REFERENCES Autores (aut_id);
ALTER TABLE Autor_Libro ADD CONSTRAINT FKAutor_Libr206080 FOREIGN KEY (libro_id) REFERENCES Libros (lib_id);
ALTER TABLE Compras ADD CONSTRAINT FKCompras958071 FOREIGN KEY (empleado_id) REFERENCES Empleados (emp_id);
ALTER TABLE Ejemplares ADD CONSTRAINT FKEjemplares412760 FOREIGN KEY (libro_id) REFERENCES Libros (lib_id);
ALTER TABLE Ejemplares ADD CONSTRAINT FKEjemplares741490 FOREIGN KEY (lote_id) REFERENCES Lotes (lot_id);
ALTER TABLE Empleados ADD CONSTRAINT FKEmpleados672700 FOREIGN KEY (direccion_id) REFERENCES Direcciones (dir_id);
ALTER TABLE Empleados ADD CONSTRAINT FKEmpleados542396 FOREIGN KEY (manager_id) REFERENCES Empleados (emp_id);
ALTER TABLE Salarios ADD CONSTRAINT FKSalarios715511 FOREIGN KEY (empleado_id) REFERENCES Empleados (emp_id);
ALTER TABLE Libros ADD CONSTRAINT FKLibros809936 FOREIGN KEY (genero_id) REFERENCES Generos (gen_id);
ALTER TABLE Proveedores ADD CONSTRAINT FKProveedore993281 FOREIGN KEY (direccion_id) REFERENCES Direcciones (dir_id);
ALTER TABLE Item_compra ADD CONSTRAINT FKItem_compr354842 FOREIGN KEY (ejemplares_id) REFERENCES Ejemplares (ejem_id);
ALTER TABLE Item_compra ADD CONSTRAINT FKItem_compr537480 FOREIGN KEY (compras_id) REFERENCES Compras (comp_id);
ALTER TABLE Transporte ADD CONSTRAINT FKTransporte864377 FOREIGN KEY (compras_id) REFERENCES Compras (comp_id);


INSERT INTO Editoriales(ed_nombre) VALUES ('NoBooks');
INSERT INTO Editoriales(ed_nombre) VALUES ('Gnome Press');
INSERT INTO Editoriales(ed_nombre) VALUES ('Pierre-Jules Hetzel');

INSERT INTO Autores(aut_nombre, aut_fecnac) VALUES ('Herman Melville', '1819-08-01'), 
										 ('Isaac Asimov', '1920-01-02'),
										 ('Julio Verne', '1828-02-08');
										 
INSERT INTO generos(gen_nombre) VALUES ('Novela'), ('Ciencia Ficcion'), ('Ficcion de aventuras');

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
2, 2),
('La isla misteriosa', 'The mysterious island', 9788497862752, 476, 'Portada blanda', 'Durante la guerra civil americana, cinco hombres logran escapar del asedio de Richmond en un globo aerostático que finalmente acabará estrellándose en una isla desierta de los Mares del Sur. Los cinco compañeros no tienen nada salvo su ingenio para sobrevivir en una isla que muy pronto se mostrará llena de secretos, misterios y enigmas que jamás hubieran podido imaginar.',
3, 3)
;


-- select lib.titulo, ed.nombre_ed from libro AS lib inner join editorial AS ed ON (lib.editorial_id = ed.id);

INSERT INTO Autor_Libro(autor_id, libro_id) VALUES (1, 1), (2, 2), (3, 3);

-- SELECT lib.Titulo, aut.Nombre, ed.Nombre_ed FROM libro AS lib INNER JOIN autor_libro AS alib ON (lib.id = alib.libro_id) INNER JOIN Autor AS aut ON(aut.id = alib.autor_id) INNER JOIN editorial AS ed ON (lib.editorial_id = ed.id)
