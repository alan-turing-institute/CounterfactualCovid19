import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import CounterfactualStatistics from "./CounterfactualStatistics";
import CounterfactualStory from "./CounterfactualStory";
import CountryDates from "./CountryDates";
import CountryStatistics from "./CountryStatistics";
import DateChooser from "./DateChooser";
import exact from "prop-types-exact";
import Histogram from "./Histogram";
import loadCountryDemographicsTask from "../tasks/LoadCountryDemographicTask.js";
import loadRealDatesTask from "../tasks/LoadRealDatesTask.js";
import LoadCounterfactualRestrictionsDatesTask from "../tasks/LoadCounterfactualDatesTask.js";
import LoadPerCountryStatisticsTask from "../tasks/LoadPerCountryStatisticsTask.js";
import PropTypes from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

const propTypes = exact({
  isoCode: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
});

const defaultProps = {};

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowedDatesFirstRestrictions: null,
      allowedDatesLockdown: null,
      countryName: null,
      countryPopulationDensity: null,
      dateFirstWaveStart: null,
      dateFirstWaveEnd: null,
      dateFirstRestrictionsCounterfactual: null,
      dateFirstRestrictionsReal: null,
      dateLockdownCounterfactual: null,
      dateLockdownReal: null,
      dateHistogramStart: "2020-02-20",
      dateHistogramEnd: "2020-07-06",
      totalCasesCounterfactual: null,
      totalCasesReal: null,
      totalDeathsReal: null,
    };
    this.initial_state = this.state;

    // Bind the datepicker change functions to allow them to be used by other objects
    this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
    this.onLockdownChange = this.onLockdownChange.bind(this);
  }

  daysDelta(date1, date2) {
    // Get the time difference between two dates.
    if (!date1 || !date2) {
      return 0;
    }
    const secondsDelta = new Date(date1) - new Date(date2);
    return secondsDelta / (1000 * 3600 * 24);
  }

  async loadStatisticsReal() {
    const task = new LoadPerCountryStatisticsTask();
    try {
      const realCases = await task.loadIntegratedCases(
        this.props.isoCode,
        this.state.dateHistogramEnd
      );
      const realDeaths = await task.loadIntegratedDeaths(
        this.props.isoCode,
        this.state.dateHistogramEnd
      );
      this.setState({
        totalCasesReal: realCases.summed_avg_cases_per_million,
        totalDeathsReal: realDeaths.summed_avg_deaths_per_million,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadStatisticsCounterfactual() {
    try {
      const task = new LoadPerCountryStatisticsTask();
      const counterfactualCases = await task.loadIntegratedCounterfactualCases(
        this.props.isoCode,
        this.state.dateHistogramStart,
        this.state.dateHistogramEnd,
        this.state.dateFirstRestrictionsCounterfactual,
        this.state.dateLockdownCounterfactual
      );
      this.setState({
        totalCasesCounterfactual:
          counterfactualCases.summed_avg_cases_per_million,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadDemographicData() {
    // Retrieve demographic data
    let demographics = await loadCountryDemographicsTask(this.props.isoCode);
    this.setState({
      countryName: demographics.name,
      countryPopulationDensity: demographics.population_density,
    });
  }

  async loadRestrictionData() {
    // Retrieve restriction data
    try {
      const realDates = await loadRealDatesTask(this.props.isoCode);
      // Set the component state with the restriction data
      this.setState({
        dateFirstRestrictionsCounterfactual: realDates.first_restrictions_date,
        dateFirstRestrictionsReal: realDates.first_restrictions_date,
        dateLockdownCounterfactual: realDates.lockdown_date,
        dateLockdownReal: realDates.lockdown_date,
        dateHistogramStart:
          realDates.initial_date || this.state.dateHistogramStart,
        dateHistogramEnd: realDates.maximum_date || this.state.dateHistogramEnd,
        dateFirstWaveStart: "XXXX",
        dateFirstWaveEnd: realDates.maximum_date,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadAllowedDates() {
    const task = new LoadCounterfactualRestrictionsDatesTask();
    const lockdownDates = await task.loadLockdownDates(this.props.isoCode);
    const firstRestrictionsDates = await task.loadFirstRestrictionsDates(
      this.props.isoCode
    );
    this.setState({
      allowedDatesFirstRestrictions:
        "possible_restrictions_dates" in firstRestrictionsDates
          ? firstRestrictionsDates.possible_restrictions_dates
          : null,
      allowedDatesLockdown:
        "possible_lockdown_dates" in lockdownDates
          ? lockdownDates.possible_lockdown_dates
          : null,
    });
  }

  async reloadStateData() {
    await Promise.all([
      this.loadDemographicData(),
      this.loadRestrictionData(),
      this.loadStatisticsReal(),
      this.loadStatisticsCounterfactual(),
      this.loadAllowedDates(),
    ]);
  }

  // this runs when the info panel is first mounted
  async componentDidMount() {
    await this.reloadStateData();
  }

  // this runs when we click in a new country, reload all date information
  async componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      await this.reloadStateData();
    }
  }

  // this runs when we change the first restrictions counterfactual date
  async onFirstRestrictionsChange(newDate) {
    this.setState({ dateFirstRestrictionsCounterfactual: newDate });
    console.log(
      `Set counterfactual first restrictions date to ${this.state.dateFirstRestrictionsCounterfactual}`
    );
    await this.loadStatisticsCounterfactual();
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    this.setState({ dateLockdownCounterfactual: newDate });
    console.log(
      `Set counterfactual lockdown date to ${this.state.dateLockdownCounterfactual}`
    );
    await this.loadStatisticsCounterfactual();
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
                    dateFirstRestrictions={this.state.dateFirstRestrictionsReal}
                    dateFirstWaveEnd={this.state.dateFirstWaveEnd}
                    dateFirstWaveStart={this.state.dateFirstWaveStart}
                    dateLockdown={this.state.dateLockdownReal}
                  />
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <CountryStatistics
                    totalCases={this.state.totalCasesReal}
                    totalDeaths={this.state.totalDeathsReal}
                    populationDensity={this.state.countryPopulationDensity}
                  />
                </Row>
              </Col>
              <Col xs={6} md={6} lg={6}>
                <Row xs={1} md={1} lg={1}>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Col>
                      <DateChooser
                        initialDate={this.state.dateFirstRestrictionsReal}
                        allowedDates={this.state.allowedDatesFirstRestrictions}
                        caption="First restrictions date"
                        onDateChange={this.onFirstRestrictionsChange}
                      />
                    </Col>
                    <Col>
                      <DateChooser
                        initialDate={this.state.dateLockdownReal}
                        allowedDates={this.state.allowedDatesLockdown}
                        caption="Lockdown date"
                        onDateChange={this.onLockdownChange}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <Histogram
                    isoCode={this.props.isoCode}
                    height={this.props.height}
                    dateInitial={this.state.dateHistogramStart}
                    dateFinal={this.state.dateHistogramEnd}
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
                    dateStart={this.state.dateHistogramStart}
                    dateEnd={this.state.dateHistogramEnd}
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
