-- creo la base de datos
CREATE DATABASE IF NOT EXISTS vinilos;
USE vinilos;

-- Creo las  tablas
CREATE TABLE generos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50)
);

CREATE TABLE bandas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  genero_id INT,
  FOREIGN KEY (genero_id) REFERENCES generos(id)
);

CREATE TABLE vinilos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  precio DECIMAL(10,2),
  banda_id INT,
  FOREIGN KEY (banda_id) REFERENCES bandas(id)
);

-- Insertar generos
INSERT INTO generos (nombre) VALUES 
('BlackMetal'), ('Metal'), ('Rock'), ('Pop'), ('Punk');

-- Inserto las bandas
INSERT INTO bandas (nombre, genero_id) VALUES
-- BlackMetal
('Burzum', 1), ('Mayhem', 1), ('Marduk', 1), ('Gorgoroth', 1), ('Nargaroth', 1),
-- Metal
('Metallica', 2), ('Iron Maiden', 2), ('Pantera', 2), ('Megadeth', 2), ('Slayer', 2),
-- Rock
('Queen', 3), ('The Beatles', 3), ('Led Zeppelin', 3), ('Pink Floyd', 3), ('The Rolling Stones', 3),
-- Pop
('Madonna', 4), ('Michael Jackson', 4), ('Lady Gaga', 4), ('Dua Lipa', 4), ('Adele', 4),
-- Punk
('The Ramones', 5), ('Sex Pistols', 5), ('Dead Kennedys', 5), ('Misfits', 5), ('Bad Religion', 5);

-- Insertar vinilos (3 por banda)
-- BlackMetal
INSERT INTO vinilos (nombre, precio, banda_id) VALUES
('Filosofem', 12000, 1), ('Hvis Lyset Tar Oss', 11500, 1), ('Aske', 11000, 1),
('De Mysteriis Dom Sathanas', 13000, 2), ('Deathcrush', 12500, 2), ('Live in Leipzig', 12000, 2),
('Panzer Division Marduk', 11000, 3), ('Opus Nocturne', 10500, 3), ('Those of the Unlight', 10000, 3),
('Twilight of the Idols', 11500, 4), ('Pentagram', 11000, 4), ('Under the Sign of Hell', 10500, 4),
('Geliebte Des Regens', 9500, 5), ('Prosatanica Shooting Angels', 9800, 5), ('Black Metal ist Krieg', 9900, 5),

-- Metal
('Master of Puppets', 14000, 6), ('Ride the Lightning', 13500, 6), ('Kill \'Em All', 13000, 6),
('The Number of the Beast', 12500, 7), ('Powerslave', 12000, 7), ('Fear of the Dark', 11500, 7),
('Cowboys from Hell', 11000, 8), ('Vulgar Display of Power', 10500, 8), ('Far Beyond Driven', 10000, 8),
('Rust in Peace', 13000, 9), ('Countdown to Extinction', 12500, 9), ('Peace Sells', 12000, 9),
('Reign in Blood', 11500, 10), ('South of Heaven', 11000, 10), ('Seasons in the Abyss', 10500, 10),

-- Rock
('A Night at the Opera', 14000, 11), ('News of the World', 13500, 11), ('Innuendo', 13000, 11),
('Abbey Road', 12500, 12), ('Sgt. Pepper\'s Lonely Hearts Club Band', 12000, 12), ('Revolver', 11500, 12),
('IV', 11000, 13), ('Physical Graffiti', 10500, 13), ('Houses of the Holy', 10000, 13),
('The Dark Side of the Moon', 13000, 14), ('Wish You Were Here', 12500, 14), ('Animals', 12000, 14),
('Sticky Fingers', 11500, 15), ('Let It Bleed', 11000, 15), ('Exile on Main St.', 10500, 15),

-- Pop
('Like a Virgin', 9500, 16), ('Ray of Light', 9800, 16), ('True Blue', 9900, 16),
('Thriller', 14000, 17), ('Bad', 13500, 17), ('Dangerous', 13000, 17),
('The Fame', 12500, 18), ('Born This Way', 12000, 18), ('Chromatica', 11500, 18),
('Future Nostalgia', 11000, 19), ('Radical Optimism', 10500, 19), ('Dua Lipa', 10000, 19),
('21', 13000, 20), ('25', 12500, 20), ('30', 12000, 20),

-- Punk
('Ramones', 9500, 21), ('Rocket to Russia', 9800, 21), ('End of the Century', 9900, 21),
('Never Mind the Bollocks', 14000, 22), ('Spunk', 13500, 22), ('Live 76', 13000, 22),
('Fresh Fruit for Rotting Vegetables', 12500, 23), ('Plastic Surgery Disasters', 12000, 23), ('Bedtime for Democracy', 11500, 23),
('Walk Among Us', 11000, 24), ('Earth A.D.', 10500, 24), ('Static Age', 10000, 24),
('No Control', 13000, 25), ('Suffer', 12500, 25), ('The Gray Race', 12000, 25);
