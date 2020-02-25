#! /bin/env python

import pdfplumber
import sqlite3
from pprint import pprint
from datetime import datetime
import time
import sys
import hashlib

days = ['P O N E D E L J A K', 'U T O R A K',
        'S R E D A', 'Č E T V R T A K', 'P E T A K',
        'S U B O T A', 'N E D E L J A']
clas = ['Pred.', 'lab.vežbe', 'aud.vežbe', 'rač.vežbe', 'arh.vežbe']
wildcard = 'SVI'


def addClass(c):

    db_entries = []

    for g in c['grupe']:

        for sg in c['studijske_grupe']:

            db_entries.append((
                c['studijski_program'], sg, c['semestar'], c['dan'],
                c['predmet'], g, c['vreme_od'], c['vreme_do'],
                c['ucionica'], c['vrsta_nastave'], c['izvodjac']
            ))

    return db_entries


def timeInteger(string_time):

    hour, minute = string_time.split(':')

    return int(hour) + int(minute) / 60


def parsePage(p):

    db_entries = []

    words = p.extract_words()

    study_program = ''
    study_groups = []
    semester = ''

    for w in range(len(words)):

        # print(words[w]['text'])

        if words[w]['text'] == 'studije':
            if words[w-2]['text'] == 'Master':
                # end of Osnovne akademske studije, break parsing
                return []

        if words[w]['text'] == 'Semestar':
            print(words[w-1]['text'] + ' ' + words[w]['text'])
            semester = int(words[w-1]['text'])
            if study_program == '':
                wn = w + 1
                while wn < len(words) and words[wn]['text'] != 'Studijska' and \
                        (len(words[wn]['text']) > 1 or words[wn]['text'].islower()):
                    study_program += ' ' + words[wn]['text']
                    wn += 1
                study_program = study_program[1:]

        if words[w]['text'] == 'grupa:' or \
                words[w]['text'] == 'grupe:':
            group_name = ''
            wn = w + 1
            while wn < len(words) and words[wn]['text'] != 'Studijska' and \
                    (len(words[wn]['text']) > 1 or words[wn]['text'].islower()):
                print(words[wn]['text'], end=' ')
                group_name += ' ' + words[wn]['text']
                wn += 1
            print()
            study_groups.append(group_name[1:])

    if len(study_groups) == 0:
        study_groups.append(wildcard)

    tables = p.extract_tables()

    day = 0
    block_classes = False

    # Parse class entries in tables
    for t in range(len(tables)):
        for c in range(len(tables[t])):

            class_curr = tables[t][c]

            if class_curr[0] in days:
                day = days.index(class_curr[0])
                block_classes = False
                continue

            if class_curr[0] == 'Grupa-e' or class_curr[0] == 'Datum':
                continue

            if class_curr[0] == 'B L O K   N A S T A V A' or class_curr[0] == 'BLOK NASTAVA':
                block_classes = True
                continue

            if class_curr[6] == None:
                class_curr[6] = ''

            groups = class_curr[1 if block_classes else 0]

            # Grupa 'SVI' = None
            if groups == 'SVI' or groups == None:
                groups = [wildcard]
            else:
                groups = groups.split(',')

            class_object = {}

            try:

                if block_classes:

                    class_object = {
                        'studijski_program': study_program,
                        'studijske_grupe': study_groups,
                        'semestar': semester,
                        'dan': int(datetime.strptime(class_curr[0], '%d.%m.%Y').timestamp()),
                        'predmet': class_curr[6].replace('\n', ''),
                        'grupe': groups,
                        'vreme_od': timeInteger(class_curr[2]),
                        'vreme_do': timeInteger(class_curr[3]),
                        'ucionica': class_curr[4],
                        'vrsta_nastave': class_curr[5],
                        'izvodjac': class_curr[7].replace('\n', '')
                    }

                else:

                    # Temporary fix for None column
                    # if class_curr[0] == None:
                    #     class_curr[0] = wildcard

                    class_object = {
                        'studijski_program': study_program,
                        'studijske_grupe': study_groups,
                        'semestar': semester,
                        'dan': day,
                        'predmet': class_curr[5].replace('\n', ''),
                        'grupe': groups,
                        'vreme_od': timeInteger(class_curr[1]),
                        'vreme_do': timeInteger(class_curr[2]),
                        'ucionica': class_curr[3],
                        'vrsta_nastave': class_curr[4],
                        'izvodjac': class_curr[6].replace('\n', '')
                    }

                c = class_object

                for g in c['grupe']:

                    for sg in c['studijske_grupe']:

                        db_entries.append((
                            c['studijski_program'], sg, c['semestar'], c['predmet'],
                            c['vrsta_nastave'], c['dan'], g, c['vreme_od'], c['vreme_do'],
                            c['ucionica'], c['izvodjac']
                        ))

            except Exception as ex:
                print("Exception:", class_curr, ex)
                pprint(class_object)

    return db_entries


def parseDocument(filename):

    db_entries = []

    with pdfplumber.open('rac.pdf') as source:

        for page in source.pages[1:5]:
            db_entries.extend(parsePage(page))

        return db_entries


def checksum(filename):

    hasher = hashlib.sha1()
    with open(filename, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hasher.update(chunk)
    return int(hasher.hexdigest()[:8], 16)


def listGenerator(lst):
    for el in lst:
        if isinstance(el, (list, tuple)):
            yield tuple(el)
        else:
            yield (el,)

def getUnique(lst, col, constraints=[]):
    unique = set()
    for el in lst:
        for cn in range(len(constraints)):
            if constraints[cn] == None:
                continue
            elif el[cn] != constraints[cn]:
                break
        else:
            unique.add(el[col])
    return list(unique)

def getClasses(lst, constraints=[]):
    classes = list()
    for el in lst:
        for cn in range(len(constraints)):
            if constraints[cn] == None:
                continue
            elif el[cn] != constraints[cn]:
                break
        else:
            classes.append(el[4:])
    return classes

sql_connector = sqlite3.connect('database/raspored.db')
sql_db = sql_connector.cursor()

with open('database/scripts/create.sql', 'r') as db_init:
    sql_db.executescript(db_init.read())

sql_db.execute("SELECT id, naziv, checksum FROM izvorni_dokument")
files = sql_db.fetchall()

sql_db.executemany("INSERT OR IGNORE INTO vrsta_nastave \
(vrsta_nastave) VALUES (?)", listGenerator(clas))

if len(sys.argv) == 2:
    files = [files[int(sys.argv[1])]]
elif len(sys.argv) == 3:
    files = files[int(sys.argv[1]):int(sys.argv[2])+1]

for f in files:

    print(f[1])

    db_entries = []

    csum = checksum(f'storage/{f[1]}.pdf')

    if csum == f[2]:
        print('skip')
        continue
    
    with open('database/scripts/clean.sql', 'r') as db_clean:
        sql_db.executescript(db_clean.read().replace( \
        '$IZVORNI_DOKUMENTI', f"({f[0]})"))

    with pdfplumber.open(f'storage/{f[1]}.pdf') as source:

        for page in source.pages:
            db_entries.extend(parsePage(page))

    for studijski_program in getUnique(db_entries, 0):

        sql_db.execute(f"INSERT INTO studijski_program \
            ( studijski_program, izvorni_dokument_id ) VALUES \
            ('{studijski_program}', {f[0]})")

        studijski_program_id = sql_db.lastrowid

        for studijska_grupa in getUnique(db_entries, 1, \
            [studijski_program]):

            sql_db.execute(f"INSERT INTO studijska_grupa \
            ( studijska_grupa, studijski_program_id ) VALUES \
            ('{studijska_grupa}', {studijski_program_id})")

            studijska_grupa_id = sql_db.lastrowid

            for semestar in getUnique(db_entries, 2, \
                [studijski_program, studijska_grupa]):

                sql_db.execute(f"INSERT INTO semestar \
                ( semestar, studijska_grupa_id ) VALUES \
                ({semestar}, {studijska_grupa_id})")

                semestar_id = sql_db.lastrowid

                for predmet in getUnique(db_entries, 3, \
                    [studijski_program, studijska_grupa, semestar]):

                    sql_db.execute(f"INSERT INTO predmet \
                    ( predmet, semestar_id ) VALUES \
                    ('{predmet}', {semestar_id})")

                    predmet_id = sql_db.lastrowid

                    for cas in getClasses(db_entries, \
                        [studijski_program, studijska_grupa, \
                        semestar, predmet]):

                        sql_db.execute(f"INSERT INTO cas \
                        ( vrsta_nastave_id, predmet_id, grupa, \
                        dan, vreme_od, vreme_do, ucionica, \
                        izvodjaci ) VALUES \
                        ((SELECT id FROM vrsta_nastave WHERE \
                        vrsta_nastave = '{cas[0]}'),\
                        {predmet_id}, '{cas[2]}', {cas[1]}, \
                        {cas[3]}, {cas[4]}, '{cas[5]}', '{cas[6]}')")


    sql_db.execute(f"UPDATE izvorni_dokument SET \
    obradjeno = {int(time.time())}, checksum = {csum} \
    WHERE naziv = '{f[1]}'")

    sql_connector.commit()

sql_connector.commit()
sql_connector.close()