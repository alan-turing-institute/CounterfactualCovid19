# CounterfactualCovid19
Welcome to the Counterfactual Covid19 repository. This is a Leeds-Turing project that aims to visualise the counterfactual history of the growth of COVID-19 cases in Europe.

This repository contains two subdirectories:

* *backend*: This directory contains `Django` code that loads COVID-19 data from this [repo](https://github.com/KFArnold/covid-lockdown) and produces counterfactual simulations (the code for the counterfactual simulations is [here](backend/counterfactual/simulation.py)).
* *frontend*: This directory contains `react-leaflet` code to visualise the COVID-19 data and counterfactual simulations based on this [repo](https://github.com/CodingWith-Adam/covid19-map).

## Manual setup

### Prerequisites

Both the [frontend](frontend/README.md) and the [backend](backend/README.md) have their own set of prerequisites that you will need to install in order to run this app.

### Running the app

Ensure that the PostgreSQL database is running:

```bash
pg_ctl -D /usr/local/var/postgres start
```

Then run the Django backend from the `backend/` directory with:

```bash
poetry run python3 manage.py runserver
```

followed by the React frontend from the `frontend/` directory with:

```bash
npm start
```

The app should then be available at `http://localhost:3000`


## Docker setup

### Prerequisites

[Docker](https://www.docker.com/) is the only prerequisite for the Dockerised version of the app.

### Running the app

Launch the app by running the following:

```bash
docker-compose up -d
```

This will create a series of persistent docker-compose images so that future runs will be faster to start up.
Note that although `npm` reports several vulnerabilities, we are using the latest versions of all requested libraries - no security fixes are available.

To cleanup all images and force a full rebuild do

```bash
docker-compose down -v --rmi all --remove-orphans
```
