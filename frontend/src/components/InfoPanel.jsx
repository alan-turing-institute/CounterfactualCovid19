import "../css/InfoPanel.css";
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
import LoadRestrictionsDatesTask from "../tasks/LoadRestrictionsDatesTask.js";
import LoadTotalCasesTask from "../tasks/LoadTotalCasesTask.js";
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
    };
    this.initial_state = this.state;

    // Bind the datepicker change functions to allow them to be used by other objects
    this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
    this.onLockdownChange = this.onLockdownChange.bind(this);
  }

  async loadCasesReal() {
    const task = new LoadTotalCasesTask();
    try {
      const realCases = await task.getIntegratedCasesCountryData(
        this.props.isoCode,
        this.state.dateHistogramEnd
      );
      this.setState({ totalCasesReal: realCases.summed_avg_cases_per_million });
    } catch (error) {
      console.log(error);
    }
  }

  async loadCasesCounterfactual() {
    const task = new LoadTotalCasesTask();
    try {
      const counterfactualCases =
        await task.getIntegratedCounterfactualCountryData(
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
    const task = new LoadRestrictionsDatesTask();
    try {
      const restrictionsDates = await task.getCountryRestrictionDates(
        this.props.isoCode
      );
      // Set the component state with the restriction data
      this.setState({
        dateFirstRestrictionsCounterfactual:
          restrictionsDates.first_restrictions_date,
        dateFirstRestrictionsReal: restrictionsDates.first_restrictions_date,
        dateLockdownCounterfactual: restrictionsDates.lockdown_date,
        dateLockdownReal: restrictionsDates.lockdown_date,
        dateHistogramStart:
          restrictionsDates.initial_date || this.state.dateHistogramStart,
        dateHistogramEnd:
          restrictionsDates.maximum_date || this.state.dateHistogramEnd,
        dateFirstWaveStart: "XXXX",
        dateFirstWaveEnd: restrictionsDates.maximum_date,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async reloadStateData() {
    await Promise.all([
      this.loadDemographicData(),
      this.loadRestrictionData(),
      this.loadCasesReal(),
      this.loadCasesCounterfactual(),
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
    await this.setState({ dateFirstRestrictionsCounterfactual: newDate });
    console.log(
      `Set counterfactual first restrictions date to ${this.state.dateFirstRestrictionsCounterfactual}`
    );
    await this.loadCasesCounterfactual();
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    await this.setState({ dateLockdownCounterfactual: newDate });
    console.log(
      `Set counterfactual lockdown date to ${this.state.dateLockdownCounterfactual}`
    );
    await this.loadCasesCounterfactual();
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
                        dateString={
                          this.state.dateFirstRestrictionsCounterfactual
                        }
                        key="date-first-restrictions"
                        onDateChange={this.onFirstRestrictionsChange}
                      />
                    </Col>
                    <Col>
                      <DateChooser
                        dateString={this.state.dateLockdownCounterfactual}
                        key="date-lockdown"
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
                    dateEnd={this.state.dateHistogramEnd}/>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <CounterfactualStatistics
                    totalCasesCounterfactual={
                      this.state.totalCasesCounterfactual
                    }
                    totalCasesReal={this.state.totalCasesReal}
                    shiftFirstRestrictions={new Date(this.state.dateFirstRestrictionsReal)-new Date(this.state.dateFirstRestrictionsCounterfactual)}
                    shiftLockdown={new Date(this.state.dateLockdownReal)-new Date(this.state.dateLockdownCounterfactual)}
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
