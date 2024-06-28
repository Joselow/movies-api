use moviesdb;

create TABLE genres (
	id int UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name varchar(50)
);


CREATE TABLE movies (
    id BINARY(16) PRIMARY KEY,
    title VARCHAR(100),
    year YEAR,
    director VARCHAR(100),
    duration INT,
    poster VARCHAR(255),
    rate DECIMAL(3,2)
);

CREATE TABLE movies_genres (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    movie_id BINARY(16),
    genre_id INT UNSIGNED,
);

-- Insertar géneros
INSERT INTO genres (name) VALUES
('Action'),
('Comedy'),
('Drama'),
('Horror'),
('Science Fiction');

-- Insertar películas
INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID()), 'Inception', 2010, 'Christopher Nolan', 148, 'inception.jpg', 8.8),
(UUID_TO_BIN(UUID()), 'The Matrix', 1999, 'Lana Wachowski, Lilly Wachowski', 136, 'matrix.jpg', 8.7),
(UUID_TO_BIN(UUID()), 'Parasite', 2019, 'Bong Joon Ho', 132, 'parasite.jpg', 8.6),
(UUID_TO_BIN(UUID()), 'The Godfather', 1972, 'Francis Ford Coppola', 175, 'godfather.jpg', 9.2),
(UUID_TO_BIN(UUID()), 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'dark_knight.jpg', 9.0);

-- La sintaxis con UNION ALL está diseñada para manejar múltiples inserciones 

INSERT INTO movies_genres (movie_id, genre_id)
SELECT id, 1 FROM movies WHERE title = 'Inception' UNION ALL
SELECT id, 5 FROM movies WHERE title = 'Inception' UNION ALL
SELECT id, 1 FROM movies WHERE title = 'The Matrix' UNION ALL
SELECT id, 5 FROM movies WHERE title = 'The Matrix' UNION ALL
SELECT id, 3 FROM movies WHERE title = 'Parasite' UNION ALL
SELECT id, 3 FROM movies WHERE title = 'The Godfather' UNION ALL
SELECT id, 1 FROM movies WHERE title = 'The Dark Knight';
