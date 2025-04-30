CREATE TABLE IF NOT EXISTS pitch (
    id              TEXT PRIMARY KEY,
    note_letter     TEXT,
    accidental      TEXT,
    octave          SMALLINT,
    midi_number     SMALLINT,
    position        SMALLINT
);