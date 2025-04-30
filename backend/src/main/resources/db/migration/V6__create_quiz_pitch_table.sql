CREATE TABLE IF NOT EXISTS quiz_pitch (
    id                         BIGSERIAL PRIMARY KEY,
    quiz_id                    BIGINT REFERENCES quiz(id),
    pitch_id                   TEXT REFERENCES pitch(id),
    transposed_answer_pitch_id TEXT REFERENCES pitch(id)
);