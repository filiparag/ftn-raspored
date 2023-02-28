#!/bin/sh

echo 'Downloading PDF sources'
./update.py || exit 1

echo 'Parsing data'
./parse.py || exit 2

echo 'Exporting database'
cp -f ./database/raspored.db /var/db/raspored.db || exit 3
