# CounterfactualCovid19
Welcome to the Counterfactual Covid19 repository. This is a Leeds-Turing project that aims to visualise the counterfactual history of the growth of COVID-19 cases in Europe.

This repository contains three subdirectories:

* *counterfactual_calculations*:  This directory contains python code for simulating the growth of COVID-19 cases and is largely based on this original [repository](https://github.com/KFArnold/covid-counterfactual).
* *backend*: This directory contains `Django` code to produce COVID-19 data and counterfactual simulations
* *frontend*: This directory contains `react-leaflet` code to visualise the COVID-19 data and counterfactual simulations based on this [repo](https://github.com/CodingWith-Adam/covid19-map)

## Manual setup

### Prerequisites

Both the [frontend](frontend/README.md) and the [backend](backend/README.md) have their own set of prerequisites that you will need to install in order to run this app.

### Running the app

Run the Django backend from the `backend/` directory with:

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

This will create a series of persistent docker-compose images so that future runs will be faster to start up. To cleanup all images and force a full rebuild do

```bash
docker-compose down -v --rmi all --remove-orphans
```
