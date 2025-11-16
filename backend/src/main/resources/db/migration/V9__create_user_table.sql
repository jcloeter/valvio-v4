-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(255),
    photo_url TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on firebase_uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid
    ON users(firebase_uid);

-- Add user_id foreign key to quiz_attempt table
ALTER TABLE quiz_attempt
ADD COLUMN IF NOT EXISTS user_id BIGINT,
ADD CONSTRAINT fk_quiz_attempt_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL;

-- Create index on user_id for faster joins
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_user_id
    ON quiz_attempt(user_id);

