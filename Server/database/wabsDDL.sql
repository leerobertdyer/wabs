CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    score INTEGER,
    user_status VARCHAR(100),
    date_user_joined DATE,
    user_profile_pic VARCHAR(255)
);

CREATE TABLE login(
    user_id INTEGER REFERENCES users(user_id),
    hash VARCHAR(255)
);

CREATE TABLE songs(
    song_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    lyrics VARCHAR(455),
    votes INTEGER,
    song_file VARCHAR(255) UNIQUE NOT NULL,
    song_date DATE
);