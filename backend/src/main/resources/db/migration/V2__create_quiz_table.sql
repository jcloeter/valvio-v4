CREATE TABLE IF NOT EXISTS quiz_unit (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT
);

CREATE TABLE IF NOT EXISTS quiz_type (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT
);

CREATE TABLE IF NOT EXISTS quiz (
    id                   BIGSERIAL PRIMARY KEY,
    name                 TEXT,
    quiz_unit_id         BIGINT REFERENCES quiz_unit(id),
    quiz_type_id         BIGINT REFERENCES quiz_type(id),
    level                BIGINT,
    length               BIGINT
);