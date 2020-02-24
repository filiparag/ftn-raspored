-- PRAGMA writable_schema = 1;
-- delete from sqlite_master where type in ('table', 'index', 'trigger');
-- PRAGMA writable_schema = 0;
-- VACUUM;
-- PRAGMA INTEGRITY_CHECK;

CREATE TABLE IF NOT EXISTS cas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    predmet_id INTEGER NOT NULL,
    vrsta_nastave_id INTEGER NOT NULL,
    grupa TEXT DEFAULT NULL,
    dan INTEGER NOT NULL,
    vreme_od INTEGER NOT NULL,
    vreme_do INTEGER NOT NULL,
    ucionica TEXT NOT NULL,
    izvodjaci TEXT,
    FOREIGN KEY (predmet_id)
    REFERENCES predmet (id)
        ON INSERT RESTRICT
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
    FOREIGN KEY (vrsta_nastave_id)
    REFERENCES vrsta_nastave (id)
        ON INSERT RESTRICT
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
    CHECK (vreme_od<24)
    CHECK (vreme_do<24)
);

CREATE TABLE IF NOT EXISTS vrsta_nastave (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vrsta_nastave TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS predmet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    predmet TEXT NOT NULL,
    semestar_id INTEGER NOT NULL,
    FOREIGN KEY (semestar_id)
    REFERENCES semestar (id)
        ON INSERT RESTRICT
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS semestar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    semestar INTEGER NOT NULL,
    studijska_grupa_id INTEGER NOT NULL,
    FOREIGN KEY (studijska_grupa_id)
    REFERENCES studijska_grupa (id)
        ON INSERT RESTRICT
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
    CHECK (semestar<=8)
);

CREATE TABLE IF NOT EXISTS studijska_grupa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studijska_grupa TEXT DEFAULT NULL,
    studijski_program_id INTEGER NOT NULL,
    FOREIGN KEY (studijski_program_id)
    REFERENCES studijski_program (id)
        ON INSERT RESTRICT
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS studijski_program (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studijski_program TEXT NOT NULL UNIQUE,
    izvorni_dokument_id INTEGER NOT NULL,
    FOREIGN KEY (izvorni_dokument_id)
    REFERENCES izvorni_dokument (id)
        ON INSERT RESTRICT
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS izvorni_dokument (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    naziv TEXT NOT NULL UNIQUE,
    dopremljeno INTEGER DEFAULT 0,
    obradjeno INTEGER DEFAULT 0,
    checksum INTEGER DEFAULT NULL
);