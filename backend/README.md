# CounterfactualCovid19 backend
This project was bootstrapped with [Django start project](https://docs.djangoproject.com/en/3.1/ref/django-admin/#startproject).

## Prerequisites
You will need to install the following dependencies in order to run this app:

- [Python](#python)

### Python

This package requires Python 3.7 or greater.

#### Install using conda

```bash
conda create -n counterfactual python=3.7.9
conda activate counterfactual
```

#### Install using pyenv

```bash
pyenv install 3.7.9
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

## Running the backend

Run the Django backend from the `backend/` directory with:

```bash
python manage.py runserver
```
