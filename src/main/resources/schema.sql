CREATE DATABASE IF NOT EXISTS document_vault;
USE document_vault;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    roles VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    size BIGINT,
    data LONGBLOB,
    upload_date DATETIME,
    tags VARCHAR(255),
    user_id BIGINT NOT NULL,
    encrypted BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    details VARCHAR(255),
    timestamp DATETIME,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data
INSERT INTO users (username, email, password) VALUES ('admin', 'admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOp.SsaXB3x39mOdVrUg.x9.Z.Z.Z.Z.'); -- password: password
INSERT INTO user_roles (user_id, roles) VALUES (1, 'ROLE_ADMIN');
