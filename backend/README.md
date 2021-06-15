# CounterfactualCovid19 backend
This project was bootstrapped with [Django start project](https://docs.djangoproject.com/en/3.1/ref/django-admin/#startproject).

## Prerequisites
You will need to install the following dependencies in order to run this app:

- [PostgreSQL](#postgresql)
- [Python](#python)

### PostgreSQL

You will need to install `PostgreSQL` [following the instructions for your OS](https://www.postgresql.org/download/). For example, for OSX using `Homebrew` you would run:

```bash
brew install postgresql
initdb /usr/local/var/postgres # note that you can use another location if preferred
pg_ctl -D /usr/local/var/postgres start
createdb counterfactualcovid
```

You can test that `PostgreSQL` is correctly configured by running

```bash
psql counterfactualcovid -c "SELECT * FROM pg_user;"
```

and checking that you get a list of users back.

### Python

This package requires Python 3.7 or greater.

#### Install using pyenv

You need to have `pyenv` installed. Then just run:

```bash
pyenv install 3.7.9
```

Note that if you are using `macOS` you may need the following additional environment variables:

```bash
PYTHON_CONFIGURE_OPTS="--enable-loadable-sqlite-extensions --enable-optimizations --with-openssl=$(brew --prefix openssl)" LDFLAGS="${LDFLAGS} -L/usr/local/opt/sqlite/lib" CPPFLAGS="${CPPFLAGS} -I/usr/local/opt/sqlite/include" pyenv install 3.7.9
```

Now you can create a virtual environment and set it for local use:

```bash
pyenv virtualenv 3.7.9 counterfactual
pyenv local counterfactual
```

### Python package dependencies

This project manages packages using [`poetry`](https://python-poetry.org/). Install them by doing the following from the `backend/` directory:

```bash
pip3 install --upgrade pip setuptools
pip3 install poetry
poetry install
```

## Initialising the backend

On first run you will need to setup the database with the following commands:

```bash
poetry run python3 manage.py makemigrations
poetry run python3 manage.py migrate
poetry run python3 manage.py loaddata countries 
poetry run python3 manage.py runscript cases_load 
poetry run python3 manage.py runscript important_dates_load
poetry run python3 manage.py runscript knotpoint_dates_load
poetry run python3 manage.py runscript possibledates_load 
```

## Running the backend

Run the Django backend from the `backend/` directory with:

```bash
poetry run python3 manage.py runserver
```
