# pull official base image
FROM python:3.10.6-alpine

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN apk add --update --no-cache postgresql-client
# install temp dependencies for build of pyscopg2 etc
RUN apk add --update --no-cache --virtual .tmp-build-deps \
  postgresql-dev
RUN pip install -r requirements.txt \
  && apk del --no-cache .tmp-build-deps

# copy entrypoint.sh
COPY ./entrypoint.sh .

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
