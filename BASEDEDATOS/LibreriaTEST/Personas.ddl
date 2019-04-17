CREATE TABLE personas (
  pers_id          int(10) NOT NULL AUTO_INCREMENT, 
  pers_nombre      varchar(50) NOT NULL, 
  pers_sexo        tinyint(1) NOT NULL, 
  pers_fnac        date, 
  pers_edad_padre  int(10), 
  pers_edad_madre  int(10), 
  pers_edad_muerte int(10), 
  pers_padre       int(10), 
  pers_madre       int(10), 
  PRIMARY KEY (pers_id)) type=InnoDB;
ALTER TABLE personas ADD CONSTRAINT FKpersonas705853 FOREIGN KEY (pers_padre) REFERENCES personas (pers_id);
ALTER TABLE personas ADD CONSTRAINT FKpersonas935287 FOREIGN KEY (pers_madre) REFERENCES personas (pers_id);
