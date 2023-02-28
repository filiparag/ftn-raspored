FROM python:slim

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN rm -f ./database/*.db ./storage/*.pdf
RUN mkdir -p /var/db

ENTRYPOINT ["/usr/src/app/run.sh"]
