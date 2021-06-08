import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import CounterfactualStatistics from "./CounterfactualStatistics";
import CounterfactualStory from "./CounterfactualStory";
import CountryDates from "./CountryDates";
import CountryStatistics from "./CountryStatistics";
import DateChooser from "./DateChooser";
import exact from "prop-types-exact";
import Histogram from "./Histogram";
import LoadCounterfactualRestrictionsDatesTask from "../tasks/LoadCounterfactualDatesTask.js";
import LoadPerCountryStatisticsTask from "../tasks/LoadPerCountryStatisticsTask.js";
import loadRealDatesTask from "../tasks/LoadRealDatesTask.js";
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
      dateFirstRestrictionsCounterfactual: null,
      dateFirstRestrictionsReal: null,
      dateLockdownCounterfactual: null,
      dateLockdownReal: null,
      dateModelStart: null,
      dateModelEnd: null,
      dateFirstCase: null,
      totalCasesCounterfactual: null,
      totalCasesReal: null,
      totalDeathsReal: null,
    };
    this.initial_state = this.state;

    // Bind functions that need to use `this`
    this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
    this.onLockdownChange = this.onLockdownChange.bind(this);
    this.onRealDataChange = this.onRealDataChange.bind(this);
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

  async loadStatisticsCounterfactual() {
    try {
      const task = new LoadPerCountryStatisticsTask();
      const counterfactualCases = await task.loadIntegratedCounterfactualCases(
        this.props.isoCode,
        this.state.dateModelStart,
        this.state.dateModelEnd,
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

  async loadRestrictionData() {
    // Retrieve restriction data
    try {
      const realDates = await loadRealDatesTask(this.props.isoCode);
      // Set the component state with the restriction data
      await this.setState({
        dateFirstRestrictionsCounterfactual: realDates.first_restrictions_date,
        dateFirstRestrictionsReal: realDates.first_restrictions_date,
        dateLockdownCounterfactual: realDates.lockdown_date,
        dateLockdownReal: realDates.lockdown_date,
        dateModelStart: realDates.initial_date || this.state.dateModelStart,
        dateModelEnd: realDates.maximum_date || this.state.dateModelEnd,
        dateFirstCase: realDates.first_case_date || this.state.dateModelStart,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadAllowedDates() {
    const task = new LoadCounterfactualRestrictionsDatesTask();
    const lockdownDates = await task.loadLockdownDates(
      this.props.isoCode,
      this.state.dateFirstRestrictionsCounterfactual
    );
    const firstRestrictionsDates = await task.loadFirstRestrictionsDates(
      this.props.isoCode,
      this.state.dateLockdownCounterfactual
    );
    this.setState({
      allowedDatesFirstRestrictions:
        firstRestrictionsDates && "possible_dates" in firstRestrictionsDates
          ? firstRestrictionsDates.possible_dates
          : null,
      allowedDatesLockdown:
        lockdownDates && "possible_dates" in lockdownDates
          ? lockdownDates.possible_dates
          : null,
    });
  }

  async reloadStateData() {
    await Promise.all([
      await this.loadRestrictionData(),
      await this.loadAllowedDates(),
      this.loadStatisticsCounterfactual(),
    ]);
  }

  // This runs when the info panel is first mounted
  async componentDidMount() {
    await this.reloadStateData();
  }

  // This runs when we click in a new country, reload all date information
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
    await Promise.all([
      this.loadAllowedDates(),
      this.loadStatisticsCounterfactual(),
    ]);
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    await this.setStateAsync({ dateLockdownCounterfactual: newDate });
    console.log(
      `Set counterfactual lockdown date to ${this.state.dateLockdownCounterfactual}`
    );
    await Promise.all([
      this.loadAllowedDates(),
      this.loadStatisticsCounterfactual(),
    ]);
  }

  // This runs when the CountryStatistics update
  async onRealDataChange(totalCases, totalDeaths) {
    await this.setStateAsync({
      totalCasesReal: totalCases,
      totalDeathsReal: totalDeaths,
    });
    console.log(
      `Setting totalCasesReal to ${this.state.totalCasesReal} and totalDeathsReal to ${this.state.totalDeathsReal}`
    );
  }

  render() {
    return (
      <div>
        {!this.props.isoCode ? null : (
          <Container fluid>
            <Row>
              <Col xs={3} md={3} lg={3}>
                <Row xs={1} md={1} lg={1}>
                  <CountryDates isoCode={this.props.isoCode} />
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <CountryStatistics
                    isoCode={this.props.isoCode}
                    dateEnd={this.state.dateModelEnd}
                    onDataChange={this.onRealDataChange}
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
