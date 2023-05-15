CREATE TABLE Users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BlogPosts (
                           id SERIAL PRIMARY KEY,
                           date DATE NOT NULL,
                           message TEXT NOT NULL,
                           author_id INTEGER NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (author_id) REFERENCES Users (id) ON DELETE CASCADE
);