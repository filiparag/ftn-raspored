#! /bin/env python

import urllib.request
import sqlite3
import time

sql_connector = sqlite3.connect('database/raspored.db')
sql_db = sql_connector.cursor()

with open('database/scripts/create.sql') as db_init:
    sql_db.executescript(db_init.read())

with open('storage/source.txt', 'r') as izvor:

    for i in izvor:
        if i[0] == '#':
            continue
        naziv = i.replace('\n','').split('/')[-1]
        urllib.request.urlretrieve(i, f'storage/{naziv}.pdf')
        sql_db.execute(f"INSERT OR REPLACE INTO izvorni_dokument (id, url, naziv, dopremljeno, obradjeno, checksum) \
        VALUES ((SELECT id FROM izvorni_dokument WHERE url = '{i}'), '{i}', '{naziv}', {int(time.time())}, \
        (SELECT obradjeno FROM izvorni_dokument WHERE url = '{i}'), (SELECT checksum FROM izvorni_dokument WHERE url = '{i}'))")
        

sql_connector.commit()
sql_connector.close()
