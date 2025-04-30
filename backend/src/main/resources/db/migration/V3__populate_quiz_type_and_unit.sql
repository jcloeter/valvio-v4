INSERT INTO quiz_unit (id, name) VALUES
    (1, 'Learning the Basics'),
    (2, 'Introduction to Flats and Sharps'),
    (3, 'Expanding Outward'),
    (4, 'Exploring More Accidentals'),
    (5, 'Going Up'),
    (6, 'Adding Enharmonics'),
    (7, 'Double Flats and Sharps'),
    (8, 'The Impossible Level')
ON CONFLICT DO NOTHING;

INSERT INTO quiz_type (id, name) VALUES
    (1, 'New Note'),
    (2, 'Scale'),
    (3, 'Unit Quiz'),
    (4, 'Review')
ON CONFLICT DO NOTHING;
