# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Add the backend directory to make absolute filepaths consistent across services
WORKDIR /app/backend

# Install spatialite
RUN apt-get update && apt-get -y install gdal-bin
RUN apt-get update && apt-get -y install libsqlite3-mod-spatialite

# Install Python dependencies
COPY pyproject.toml /app/backend
RUN pip3 install --upgrade pip setuptools
RUN pip3 install poetry
RUN poetry install

# Add the rest of the code
COPY . /app/backend

# Make port 8000 available for the app
EXPOSE 8000

# Set up the database
RUN apt-get update && apt-get -y install sqlite3
RUN sqlite3 --version
# RUN apt-get update && apt-get -y install spatialite
# RUN spatialite --version
RUN poetry run python3 manage.py makemigrations
RUN poetry run python3 manage.py migrate
RUN poetry run python3 manage.py loaddata countries

# Entrypoint. Note that this uses 0.0.0.0 for the host so that the browser can find it
CMD poetry run python3 manage.py runserver 0.0.0.0:8000 --noreload
