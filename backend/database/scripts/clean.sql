DROP TABLE IF EXISTS tmp_studijski_program;
DROP TABLE IF EXISTS tmp_studijska_grupa;
DROP TABLE IF EXISTS tmp_semestar;
DROP TABLE IF EXISTS tmp_predmet;

CREATE TEMPORARY TABLE tmp_studijski_program ( id INTEGER NOT NULL );
CREATE TEMPORARY TABLE tmp_studijska_grupa ( id INTEGER NOT NULL );
CREATE TEMPORARY TABLE tmp_semestar ( id INTEGER NOT NULL );
CREATE TEMPORARY TABLE tmp_predmet ( id INTEGER NOT NULL );

INSERT INTO tmp_studijski_program (id)
SELECT id FROM studijski_program WHERE izvorni_dokument_id IN (
SELECT id FROM izvorni_dokument WHERE id IN $IZVORNI_DOKUMENTI);

INSERT INTO tmp_studijska_grupa (id)
SELECT id FROM studijska_grupa WHERE studijski_program_id IN tmp_studijski_program;

INSERT INTO tmp_semestar (id)
SELECT id FROM semestar WHERE studijska_grupa_id IN tmp_studijska_grupa;

INSERT INTO tmp_predmet (id)
SELECT id FROM predmet WHERE semestar_id IN tmp_semestar;

DELETE FROM cas WHERE predmet_id IN tmp_predmet;
DELETE FROM predmet WHERE semestar_id IN tmp_semestar;
DELETE FROM semestar WHERE studijska_grupa_id IN tmp_studijska_grupa;
DELETE FROM studijska_grupa WHERE studijski_program_id IN tmp_studijski_program;
DELETE FROM studijski_program WHERE id IN tmp_studijski_program;