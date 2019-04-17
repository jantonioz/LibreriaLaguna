INSERT INTO Editoriales(Nombre_ed) VALUES ('NoBooks');
INSERT INTO Editoriales(Nombre_ed) VALUES ('Gnome Press');

INSERT INTO Autores(Nombre, fecnac) VALUES ('Herman Melville', '1819-08-01'), 
										 ('Isaac Asimov', '1920-01-02');

INSERT INTO Libros(Titulo, TituloOriginal, ISBN, Numero_pag, Dimensiones, Descripcion, editorial_id)
VALUES ('Moby-Dick', 'Moby-Dick', 9787532226320, 581, 'No.id', 
'Narra la travesía del barco ballenero Pequod, comandado por el capitán Ahab, junto a Ismael y el arponero Quiqueg en la obsesiva y autodestructiva persecución de un gran cachalote blanco.', 
1),
('Yo, robot', 'I Robot', 9780007491513, 374, 'No.id', 
'Yo, robot es una colección de relatos en los que se establecen y plantean los problemas de las tres leyes de la robótica que son un compendio fijo e imprescindible de moral aplicable a supuestos robots inteligentes.', 2);
-- select lib.titulo, ed.nombre_ed from libro AS lib inner join editorial AS ed ON (lib.editorial_id = ed.id);

INSERT INTO Autor_Libro(autor_id, libro_id) VALUES (1, 1), (2, 2);

--SELECT lib.Titulo, aut.Nombre, ed.Nombre_ed FROM libro AS lib INNER JOIN autor_libro AS alib ON (lib.id = alib.libro_id) INNER JOIN Autor AS aut ON(aut.id = alib.autor_id) INNER JOIN editorial AS ed ON (lib.editorial_id = ed.id)
