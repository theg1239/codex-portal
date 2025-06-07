DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS user_challenge_completions;
DROP TABLE IF EXISTS leaderboard;
DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,    answer TEXT NOT NULL,
    must_include TEXT
);

CREATE TABLE submissions(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    question_id INTEGER REFERENCES questions(id),
    correct BOOLEAN NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE user_challenge_completions (
    user_name VARCHAR(255) NOT NULL,
    question_id INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_name, question_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE leaderboard (
    user_name VARCHAR(255) PRIMARY KEY,
    points INTEGER NOT NULL DEFAULT 0
);