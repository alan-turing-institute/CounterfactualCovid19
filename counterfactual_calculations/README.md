# CounterfactualCovid19
Welcome to the Counterfactual Covid19 repository. This is a Leeds-Turing project that aims to visualise the counterfactual history of the growth of COVID-19 cases in Europe.


This repository contains python code for simulating and visualising the growth of COVID-19 cases and is largely based on this original [repository](https://github.com/KFArnold/covid-counterfactual).


# Installation

This package requires Python 3.6 or greater. To install, start by creating a fresh conda environment.
```
conda create -n counterfactual python=3.7
conda activate counterfactual
```

Get the source.
```
git clone https://github.com/alan-turing-institute/CounterfactualCovid19.git
```

Enter the repository and check out a relevant branch if necessary (the develop branch contains the most up to date stable version of the code).
```
cd CounterfactualCovid19/
git checkout develop
cd counterfactual_calculations
```
Install the package using `pip`.
```
pip install -r requirements.txt
```
