import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import CounterfactualStatistics from "./CounterfactualStatistics";
import CounterfactualStory from "./CounterfactualStory";
import CountryDates from "./CountryDates";
import CountryStatistics from "./CountryStatistics";
import DateChooser from "./DateChooser";
import exact from "prop-types-exact";
import Histogram from "./Histogram";
import LoadCounterfactualDatesTask from "../tasks/LoadCounterfactualDatesTask.js";
import LoadPerCountryStatisticsTask from "../tasks/LoadPerCountryStatisticsTask.js";
import loadRealDatesTask from "../tasks/LoadRealDatesTask.js";
import loadCountryDemographicsTask from "../tasks/LoadCountryDemographicTask.js";
import PropTypes from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

const propTypes = exact({
  isoCode: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
});

const defaultProps = {};

class InfoPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      allowedDatesFirstRestrictions: null,
      allowedDatesLockdown: null,
      countryName: null,
      dateFirstCase: null,
      dateFirstRestrictionsCounterfactual: null,
      dateFirstRestrictionsReal: null,
      dateLockdownCounterfactual: null,
      dateLockdownReal: null,
      dateModelStart: null,
      dateModelEnd: null,
      totalCasesCounterfactual: null,
      totalCasesReal: null,
      totalDeathsReal: null,
      populationDensity: null,
    };

    // Bind functions that need to use `this`
    this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
    this.onLockdownChange = this.onLockdownChange.bind(this);
  }

  // Create an await-able function that will not
  // resolve until the state change is completed.
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  daysDelta(date1, date2) {
    // Get the time difference between two dates.
    if (!date1 || !date2) {
      return 0;
    }
    const secondsDelta = new Date(date1) - new Date(date2);
    return secondsDelta / (1000 * 3600 * 24);
  }

  async loadRealData() {
    try {
      // Load dates and demographics
      const [dates, demographics] = await Promise.all([
        loadRealDatesTask(this.props.isoCode),
        loadCountryDemographicsTask(this.props.isoCode),
      ]);
      // Load cases and deaths
      const statistics = new LoadPerCountryStatisticsTask();
      const [cases, deaths] = await Promise.all([
        statistics.loadIntegratedCases(
          this.props.isoCode,
          dates.initial_date,
          dates.maximum_date
        ),
        statistics.loadIntegratedDeaths(
          this.props.isoCode,
          dates.initial_date,
          dates.maximum_date
        ),
      ]);
      // Update component state
      return this.setStateAsync({
        countryName: demographics.name,
        dateFirstCase: dates.first_case_date,
        dateFirstRestrictionsCounterfactual: dates.first_restrictions_date,
        dateFirstRestrictionsReal: dates.first_restrictions_date,
        dateLockdownCounterfactual: dates.lockdown_date,
        dateLockdownReal: dates.lockdown_date,
        dateModelEnd: dates.maximum_date,
        dateModelStart: dates.initial_date,
        populationDensity: demographics.population_density,
        totalCasesReal: cases.summed_avg_cases_per_million,
        totalDeathsReal: deaths.summed_avg_deaths_per_million,
        // Reset the remaining state so that stale data is cleaned up
        allowedDatesFirstRestrictions: null,
        allowedDatesLockdown: null,
        totalCasesCounterfactual: null,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadCounterfactualData() {
    try {
      const dates = new LoadCounterfactualDatesTask();
      const statistics = new LoadPerCountryStatisticsTask();
      const [firstRestrictionsDates, lockdownDates, cases] = await Promise.all([
        dates.loadFirstRestrictionsDates(
          this.props.isoCode,
          this.state.dateLockdownCounterfactual
        ),
        dates.loadLockdownDates(
          this.props.isoCode,
          this.state.dateFirstRestrictionsCounterfactual
        ),
        statistics.loadIntegratedCounterfactualCases(
          this.props.isoCode,
          this.state.dateModelStart,
          this.state.dateModelEnd,
          this.state.dateFirstRestrictionsCounterfactual,
          this.state.dateLockdownCounterfactual
        ),
      ]);
      return this.setStateAsync({
        allowedDatesFirstRestrictions: firstRestrictionsDates.possible_dates,
        allowedDatesLockdown: lockdownDates.possible_dates,
        totalCasesCounterfactual: cases.summed_avg_cases_per_million,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async reloadStateData() {
    await this.loadRealData();
    await this.loadCounterfactualData();
  }

  // This runs when the component is first mounted
  async componentDidMount() {
    await this.reloadStateData();
  }

  // This runs whenever the props or state change
  async componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      await this.reloadStateData();
    }
  }

  // This runs when we change the first restrictions counterfactual date
  async onFirstRestrictionsChange(newDate) {
    await this.setStateAsync({ dateFirstRestrictionsCounterfactual: newDate });
    console.log(
      `Set counterfactual first restrictions date to ${this.state.dateFirstRestrictionsCounterfactual}`
    );
    await this.loadCounterfactualData();
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    await this.setStateAsync({ dateLockdownCounterfactual: newDate });
    console.log(
      `Set counterfactual lockdown date to ${this.state.dateLockdownCounterfactual}`
    );
    await this.loadCounterfactualData();
  }

  render() {
    return (
      <div>
        {!this.props.isoCode ? null : (
          <Container fluid>
            <Row>
              <Col xs={3} md={3} lg={3}>
                <Row xs={1} md={1} lg={1}>
                  <CountryDates
                    countryName={this.state.countryName}
                    dateFirstWaveEnd={this.state.dateFirstCase}
                    dateFirstWaveStart={this.state.dateModelEnd}
                    dateFirstRestrictions={this.state.dateFirstRestrictionsReal}
                    dateLockdown={this.state.dateLockdownReal}
                  />
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <CountryStatistics
                    totalCases={this.state.totalCasesReal}
                    totalDeaths={this.state.totalDeathsReal}
                    populationDensity={this.state.populationDensity}
                  />
                </Row>
              </Col>
              <Col xs={6} md={6} lg={6}>
                <Row
                  xs={1}
                  md={1}
                  lg={1}
                  key={this.props.isoCode} /* Recreate whenever key changes */
                >
                  <Col xs={6} md={6} lg={6}>
                    <DateChooser
                      allowedDates={this.state.allowedDatesFirstRestrictions}
                      caption="First social distance restrictions"
                      nominalDate={this.state.dateFirstRestrictionsReal}
                      onDateChange={this.onFirstRestrictionsChange}
                    />
                  </Col>
                  <Col xs={6} md={6} lg={6}>
                    <DateChooser
                      allowedDates={this.state.allowedDatesLockdown}
                      caption="National lockdown"
                      nominalDate={this.state.dateLockdownReal}
                      onDateChange={this.onLockdownChange}
                    />
                  </Col>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <Histogram
                    isoCode={this.props.isoCode}
                    height={this.props.height}
                    dateInitial={this.state.dateFirstCase}
                    dateFinal={this.state.dateModelEnd}
                    dateFirstRestrictionsReal={
                      this.state.dateFirstRestrictionsReal
                    }
                    dateLockdownReal={this.state.dateLockdownReal}
                    dateFirstRestrictionsCounterfactual={
                      this.state.dateFirstRestrictionsCounterfactual
                    }
                    dateLockdownCounterfactual={
                      this.state.dateLockdownCounterfactual
                    }
                  />
                </Row>
              </Col>
              <Col xs={3} md={3} lg={3}>
                <Row xs={1} md={1} lg={1}>
                  <CounterfactualStory
                    dateStart={this.state.dateModelStart}
                    dateEnd={this.state.dateModelEnd}
                  />
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <CounterfactualStatistics
                    totalCasesCounterfactual={
                      this.state.totalCasesCounterfactual
                    }
                    totalCasesReal={this.state.totalCasesReal}
                    shiftFirstRestrictions={this.daysDelta(
                      this.state.dateFirstRestrictionsReal,
                      this.state.dateFirstRestrictionsCounterfactual
                    )}
                    shiftLockdown={this.daysDelta(
                      this.state.dateLockdownReal,
                      this.state.dateLockdownCounterfactual
                    )}
                  />
                </Row>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

InfoPanel.propTypes = propTypes;
InfoPanel.defaultProps = defaultProps;

export default InfoPanel;
