import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Histogram from "./Histogram";
import LoadRestrictionsDatesTask from "../tasks/LoadRestrictionsDatesTask.js";
import LoadCountryDemographicTask from "../tasks/LoadCountryDemographicTask.js";
import DatePicker from "react-date-picker";
import Loading from "./Loading";
import LoadTotalCasesTask from "../tasks/LoadTotalCasesTask.js";
import "./InfoPanel.css";
import convert from "./Utils.js";
import CountryDates from "./CountryDates";
import CountryStatistics from "./CountryStatistics";

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
      datesChanged: false,
      histogramDateFinal: null,
      histogramDateInitial: null,
      totalCasesCounterfactual: null,
      totalCasesReal: null,
      updateHistogram: false,
    };
    this.initial_state = this.state;

    // Bind the datepicker change functions to allow it to be used by other objects
    this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
    this.onLockdownChange = this.onLockdownChange.bind(this);
  }

  async loadTotalCases(
    loadRealCases,
    firstRestrictions = null,
    lockdown = null
  ) {
    const task = new LoadTotalCasesTask();
    // if there is not an available start or end date in the data use this default ones
    const dateInit =
      this.state.histogramDateInitial != null
        ? this.state.histogramDateInitial
        : "2020-02-20";
    const dateMaxim =
      this.state.histogramDateFinal != null
        ? this.state.histogramDateFinal
        : "2020-07-06";

    // reload total real cases only if necessary (when we are loading the general page)
    if (loadRealCases === true) {
      let [realCases] = await Promise.all([
        task.getIntegratedCasesCountryData(this.props.isoCode, dateMaxim),
      ]);

      if (realCases != null) {
        try {
          this.setState({
            totalCasesReal: realCases.summed_avg_cases_per_million,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    // converting DateFields that come from the DatePicker to string.
    let dateFirstRestrictionsCounterfactual;

    if (firstRestrictions == null) {
      dateFirstRestrictionsCounterfactual = convert(
        this.state.dateFirstRestrictionsCounterfactual
      );
    } else {
      dateFirstRestrictionsCounterfactual = convert(firstRestrictions);
    }

    let dateLockdownCounterfactual;

    if (lockdown == null) {
      dateLockdownCounterfactual = convert(
        this.state.dateLockdownCounterfactual
      );
    } else {
      dateLockdownCounterfactual = convert(lockdown);
    }

    let [counterfactualCases] = await Promise.all([
      task.getIntegratedCounterfactualCountryData(
        this.props.isoCode,
        dateInit,
        dateMaxim,
        dateFirstRestrictionsCounterfactual,
        dateLockdownCounterfactual
      ),
    ]);

    if (counterfactualCases != null) {
      try {
        this.setState({
          total_counterfactual_cases:
            counterfactualCases.summed_avg_cases_per_million,
        });
      } catch (error) {
        console.log(error);
      }
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
    let [restrictionsDates] = await Promise.all([
      task.getCountryRestrictionDates(this.props.isoCode),
    ]);

    if ((restrictionsDates != null) & (this.props.isoCode != null)) {
      try {
        // Set the component state with the restriction data
        this.setState({
          dateFirstRestrictionsReal: restrictionsDates.first_restrictions_date,
          dateLockdownReal: restrictionsDates.lockdown_date,
          histogramDateInitial: restrictionsDates.initial_date,
          histogramDateFinal: restrictionsDates.maximum_date,
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

        // set flag updateHistogram to true in order to render the histogram
        this.setState({ updateHistogram: true });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async reloadStateData() {
    await Promise.all([
      this.loadDemographicData(),
      this.loadRestrictionData(),
      this.loadTotalCases(true),
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
    // set updateHistogram to false to clean the histogram component
    this.setState({ updateHistogram: false });
    this.setState({ dateFirstRestrictionsCounterfactual: newDate });

    // set updateHistogram to true to render the new histogram component
    // (comment from Camila: this is a bit hacky and could be improved?)
    this.setState({ updateHistogram: true });

    // make sure that the input date for the load total cases is never null
    const counterfactualFirstRestrictions =
      newDate != null
        ? newDate
        : new Date(this.state.dateFirstRestrictionsReal);
    const dateLockdownCounterfactual =
      this.state.dateLockdownCounterfactual != null
        ? this.state.dateLockdownCounterfactual
        : new Date(this.state.dateLockdownReal);

    await this.loadTotalCases(
      false,
      counterfactualFirstRestrictions,
      dateLockdownCounterfactual
    );

    this.setState({ datesChanged: true });
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    // set updateHistogram to false to clean the histogram component
    this.setState({ updateHistogram: false });
    this.setState({ dateLockdownCounterfactual: newDate });
    // set updateHistogram to true to render the new histogram component
    this.setState({ updateHistogram: true });

    // make sure that the input date for the load total cases is never null
    const counterfactualFirstRestrictions =
      this.state.dateFirstRestrictionsCounterfactual != null
        ? this.state.dateFirstRestrictionsCounterfactual
        : new Date(this.state.dateFirstRestrictionsReal);
    const counterfactualLockdown =
      newDate != null ? newDate : new Date(this.state.dateLockdownReal);

    await this.loadTotalCases(
      false,
      counterfactualFirstRestrictions,
      counterfactualLockdown
    );

    this.setState({ datesChanged: true });
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
                        format="dd/MM/yyyy"
                        className="form-control"
                        monthsShown={1}
                        popperPlacement="bottom"
                      />
                    </Col>
                    <Col>
                      <DatePicker
                        onChange={this.onLockdownChange}
                        value={this.state.dateLockdownCounterfactual}
                        format="dd/MM/yyyy"
                        className="form-control"
                        monthsShown={1}
                        popperPlacement="bottom"
                      />
                    </Col>
                  </Row>
                </Row>
                {this.state.updateHistogram === false ? (
                  <Loading />
                ) : (
                  <Row xs={1} md={1} lg={1}>
                    <Histogram
                      isoCode={this.props.isoCode}
                      height={this.props.height}
                      dateInitial={this.state.histogramDateInitial}
                      dateFinal={this.state.histogramDateFinal}
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
                )}
              </Col>
              <Col xs={3} md={3} lg={3}>
                <Row xs={1} md={1} lg={1}>
                  <Card
                    style={{
                      marginTop: "1%",
                      marginBottom: "1%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>Counterfactual story</Card.Title>
                      <Card.Text>
                        Use the calendars to select counterfactual dates for
                        first social distance restrictions (left) and/or
                        lockdown (right).
                      </Card.Text>
                      <Card.Text> Shift first restrictions: XXX </Card.Text>
                      <Card.Text> Shift lockdown: XXX </Card.Text>
                      <Card.Text>
                        The counterfactual growth is simulated between{" "}
                        {`${this.state.histogramDateInitial}`} and{" "}
                        {`${this.state.histogramDateFinal}`}.{" "}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <Card
                    style={{
                      marginTop: "1%",
                      marginBottom: "1%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>Counterfactual Statistics</Card.Title>
                      {!this.state.totalCasesCounterfactual ? null : (
                        <Card.Text>
                          {`Total COVID-19 Cases per Million: ${this.state.totalCasesCounterfactual
                            .toFixed(0)
                            .toString()} \n `}
                        </Card.Text>
                      )}
                      {this.state.datesChanged === false ? null : (
                        <Card.Text>
                          {`Reduction in total cases: ${(
                            (1 -
                              this.state.totalCasesCounterfactual /
                                this.state.totalCasesReal) *
                            100
                          )
                            .toFixed(1)
                            .toString()} %\n `}
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Row>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
