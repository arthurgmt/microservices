-- Création de la table users
CREATE TABLE IF NOT EXISTS user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL
);

-- Création de la table file
CREATE TABLE IF NOT EXISTS file (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    user_id INT NOT NULL,
    tag VARCHAR(100)
);
