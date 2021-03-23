# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Ensure that logs appear in the correct order without buffering
ENV PYTHONUNBUFFERED=1

# Add the backend directory to make absolute filepaths consistent across services
WORKDIR /app/backend

# Install PostgreSQL client drivers
RUN apt-get update && apt-get -y install \
    build-essential \
    gdal-bin \
    libpq-dev \
    postgresql-client \
    postgresql-client-common

# Install Python dependencies
COPY pyproject.toml /app/backend
RUN pip3 install --upgrade pip setuptools
RUN pip3 install poetry
RUN poetry install

# Add the rest of the code
COPY . /app/backend

# Make port 8000 available for the app
EXPOSE 8000

# Set up the database and run the server
# Note that this uses 0.0.0.0 for the host so that the browser can find it
CMD poetry run python3 manage.py makemigrations && \
    poetry run python3 manage.py migrate && \
    poetry run python3 manage.py loaddata countries && \
    poetry run python3 manage.py runscript cases_load && \
    poetry run python3 manage.py runscript important_dates_load && \
    poetry run python3 manage.py runscript knotpoint_dates_load && \
    poetry run python3 manage.py runscript possibledates_load && \
    poetry run python3 manage.py runserver 0.0.0.0:8000
