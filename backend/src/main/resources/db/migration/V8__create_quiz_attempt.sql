CREATE TABLE IF NOT EXISTS quiz_attempt (
    id              BIGSERIAL PRIMARY KEY,
    quiz_id         BIGINT REFERENCES quiz(id),
    started_at      TIMESTAMPTZ NOT NULL,
    completed_at    TIMESTAMPTZ
);


CREATE TABLE IF NOT EXISTS quiz_pitch_attempt (
    id              BIGSERIAL PRIMARY KEY,
    quiz_attempt_id BIGINT REFERENCES quiz_attempt(id),
    pitch_id        TEXT REFERENCES pitch(id),
    user_input      TEXT,
    is_correct      BOOLEAN,
    created_at      TIMESTAMPTZ
);

