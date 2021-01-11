# CounterfactualCovid19 backend
This project was bootstrapped with [Django start project](https://docs.djangoproject.com/en/3.1/ref/django-admin/#startproject).

## Prerequisites
You will need to install the following dependencies in order to run this app:

- [Python](#python)

### SpatiaLite

You will need to install `SpatiaLite` [following the instructions for your OS](http://man.hubwiz.com/docset/Django.docset/Contents/Resources/Documents/doc/ref/contrib/gis/install/spatialite.html). For example, for OSX using `Homebrew` you would run:

```bash
brew install gdal spatialite-tools
```

### Python

This package requires Python 3.7 or greater.

#### Install using conda

```bash
conda create -n counterfactual python=3.7.9
conda activate counterfactual
conda install -c conda-forge libspatialite
```

#### Install using pyenv

Install `pyenv`
```bash
PYTHON_CONFIGURE_OPTS="--enable-loadable-sqlite-extensions --enable-optimizations --with-openssl=$(brew --prefix openssl)" \
LDFLAGS="-L/usr/local/opt/sqlite/lib" \
CPPFLAGS="-I/usr/local/opt/sqlite/include" \
pyenv install 3.7.9
```

```bash
pyenv virtualenv 3.7.9 counterfactual
pyenv local counterfactual
```

### Python package dependencies

This project manages packages using [`poetry`](https://python-poetry.org/). Install them by doing the following from the `backend/` directory:

```bash
pip install --upgrade pip setuptools
pip install poetry
poetry install
```

## Initialising the backend

On first run you will need to setup the database with the following commands:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata countries
```

## Running the backend

Run the Django backend from the `backend/` directory with:

```bash
python manage.py runserver
```
