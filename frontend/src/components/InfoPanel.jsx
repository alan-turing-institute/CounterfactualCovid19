import "../css/InfoPanel.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import convert from "./Utils.js";
import CounterfactualStatistics from "./CounterfactualStatistics";
import CounterfactualStory from "./CounterfactualStory";
import CountryDates from "./CountryDates";
import CountryStatistics from "./CountryStatistics";
import DatePicker from "react-date-picker";
import exact from "prop-types-exact";
import Histogram from "./Histogram";
import LoadCountryDemographicTask from "../tasks/LoadCountryDemographicTask.js";
import LoadRestrictionsDatesTask from "../tasks/LoadRestrictionsDatesTask.js";
import LoadTotalCasesTask from "../tasks/LoadTotalCasesTask.js";
import PropTypes from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

export default class InfoPanel extends React.Component {
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

    // Bind the datepicker change functions to allow it to be used by other objects
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
    // Convert DateFields that come from the DatePicker to string.
    const dateFirstRestrictions =
      this.state.dateFirstRestrictionsCounterfactual != null
        ? convert(this.state.dateFirstRestrictionsCounterfactual)
        : this.state.dateFirstRestrictionsReal;
    const dateLockdown =
      this.state.dateLockdownCounterfactual != null
        ? convert(this.state.dateLockdownCounterfactual)
        : this.state.dateLockdownReal;

    const task = new LoadTotalCasesTask();
    try {
      const counterfactualCases =
        await task.getIntegratedCounterfactualCountryData(
          this.props.isoCode,
          this.state.dateHistogramStart,
          this.state.dateHistogramEnd,
          dateFirstRestrictions,
          dateLockdown
        );
      this.setState({
        total_counterfactual_cases:
          counterfactualCases.summed_avg_cases_per_million,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadDemographicData() {
    // Retrieve demographic data
    const task = new LoadCountryDemographicTask();
    let demographics = await task.retrieve(this.props.isoCode);
    this.setState({
      countryName: demographics.name,
      countryPopulationDensity: demographics.population_density,
    });
  }

  async loadRestrictionData() {
    // Retrieve restriction data
    const task = new LoadRestrictionsDatesTask();
    let restrictionsDates = await task.getCountryRestrictionDates(
      this.props.isoCode
    );

    if ((restrictionsDates != null) & (this.props.isoCode != null)) {
      try {
        // Set the component state with the restriction data
        this.setState({
          dateFirstRestrictionsReal: restrictionsDates.first_restrictions_date,
          dateLockdownReal: restrictionsDates.lockdown_date,
          dateHistogramStart: restrictionsDates.initial_date,
          dateHistogramEnd: restrictionsDates.maximum_date,
          dateFirstWaveStart: "XXXX",
          dateFirstWaveEnd: restrictionsDates.maximum_date,
        });

        // we only update counterfactual if we change countries
        // set them to their actual restriction dates

        if (this.state.dateFirstRestrictionsReal != null) {
          // for the datepicker to work this needs to be a Date object.
          this.setState({
            dateFirstRestrictionsCounterfactual: new Date(
              this.state.dateFirstRestrictionsReal
            ),
          });
        }
        if (this.state.dateLockdownReal != null) {
          // for the datepicker to work this needs to be a Date object.
          this.setState({
            dateLockdownCounterfactual: new Date(this.state.dateLockdownReal),
          });
        }
      } catch (error) {
        console.log(error);
      }
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
    this.setState({ dateFirstRestrictionsCounterfactual: newDate });
    await this.loadCasesCounterfactual();
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    this.setState({ dateLockdownCounterfactual: newDate });
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
                      <DatePicker
                        onChange={this.onFirstRestrictionsChange}
                        value={this.state.dateFirstRestrictionsCounterfactual}
                        key="date-first-restrictions"
                        format="yyyy-MM-dd"
                        className="form-control"
                        monthsShown={1}
                        popperPlacement="bottom"
                      />
                    </Col>
                    <Col>
                      <DatePicker
                        onChange={this.onLockdownChange}
                        value={this.state.dateLockdownCounterfactual}
                        key="date-lockdown"
                        format="yyyy-MM-dd"
                        className="form-control"
                        monthsShown={1}
                        popperPlacement="bottom"
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
                    shiftFirstRestrictions="XXXX"
                    shiftLockdown="XXXX"
                  />
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <CounterfactualStatistics
                    totalCasesCounterfactual={
                      this.state.totalCasesCounterfactual
                    }
                    totalCasesReal={this.state.totalCasesReal}
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

InfoPanel.propTypes = exact({
  isoCode: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
});
