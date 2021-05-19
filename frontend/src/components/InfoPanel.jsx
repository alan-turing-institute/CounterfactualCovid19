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

export default class InfoPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      country_name: null,
      country_population_density: null,
      firstRestrictionsDate: null,
      lockdownDate: null,
      counterfactualFirstRestrictionsDate: null,
      counterfactualLockdownDate: null,
      initialDate: null,
      maximumDate: null,
      updateHistogram: false,
      totalRealCases: null,
      totalCounterfactualCases: null,
      datesChanged: false,
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
      this.state.initialDate != null ? this.state.initialDate : "2020-02-20";
    const dateMaxim =
      this.state.maximumDate != null ? this.state.maximumDate : "2020-07-06";

    // reload total real cases only if necessary (when we are loading the general page)
    if (loadRealCases === true) {
      let [realCases] = await Promise.all([
        task.getIntegratedCasesCountryData(this.props.isoCode, dateMaxim),
      ]);

      if (realCases != null) {
        try {
          this.setState({
            totalRealCases: realCases.summed_avg_cases_per_million,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    // converting DateFields that come from the DatePicker to string.
    let counterfactualDateFirstRestrictions;

    if (firstRestrictions == null) {
      counterfactualDateFirstRestrictions = convert(
        this.state.counterfactualFirstRestrictionsDate
      );
    } else {
      counterfactualDateFirstRestrictions = convert(firstRestrictions);
    }

    let counterfactualDateLockdown;

    if (lockdown == null) {
      counterfactualLockdown = convert(this.state.counterfactualLockdownDate);
    } else {
      counterfactualDateLockdown = convert(lockdown);
    }

    let [counterfactualCases] = await Promise.all([
      task.getIntegratedCounterfactualCountryData(
        this.props.isoCode,
        dateInit,
        dateMaxim,
        counterfactualDateFirstRestrictions,
        counterfactualDateLockdown
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
      country_name: demographics.name,
      country_population_density: demographics.population_density,
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
          firstRestrictionsDate: restrictionsDates.first_restrictions_date,
        });
        this.setState({ lockdownDate: restrictionsDates.lockdown_date });
        this.setState({ initialDate: restrictionsDates.initial_date });
        this.setState({ maximumDate: restrictionsDates.maximum_date });

        // we only update counterfactual if we change countries
        // set them to their actual restriction dates

        if (this.state.firstRestrictionsDate != null) {
          // for the datepicker to work this needs to be a Date object.
          this.setState({
            counterfactualFirstRestrictionsDate: new Date(
              this.state.firstRestrictionsDate
            ),
          });
        }
        if (this.state.lockdownDate != null) {
          // for the datepicker to work this needs to be a Date object.
          this.setState({
            counterfactualLockdownDate: new Date(this.state.lockdownDate),
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
    this.setState({ counterfactualFirstRestrictionsDate: newDate });

    // set updateHistogram to true to render the new histogram component
    // (comment from Camila: this is a bit hacky and could be improved?)
    this.setState({ updateHistogram: true });

    // make sure that the input date for the load total cases is never null
    const counterfactualFirstRestrictions =
      newDate != null ? newDate : new Date(this.state.firstRestrictionsDate);
    const counterfactualLockdownDate =
      this.state.counterfactualLockdownDate != null
        ? this.state.counterfactualLockdownDate
        : new Date(this.state.lockdownDate);

    await this.loadTotalCases(
      false,
      counterfactualFirstRestrictions,
      counterfactualLockdownDate
    );

    this.setState({ datesChanged: true });
  }

  // this runs when we change the lockdown counterfactual date
  async onLockdownChange(newDate) {
    // set updateHistogram to false to clean the histogram component
    this.setState({ updateHistogram: false });
    this.setState({ counterfactualLockdownDate: newDate });
    // set updateHistogram to true to render the new histogram component
    this.setState({ updateHistogram: true });

    // make sure that the input date for the load total cases is never null
    const counterfactualFirstRestrictions =
      this.state.counterfactualFirstRestrictionsDate != null
        ? this.state.counterfactualFirstRestrictionsDate
        : new Date(this.state.firstRestrictionsDate);
    const counterfactualLockdown =
      newDate != null ? newDate : new Date(this.state.lockdownDate);

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
                  <Card
                    style={{
                      marginTop: "1%",
                      marginBottom: "1%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>{`${this.state.country_name}`}</Card.Title>
                      <Card.Text>First case confimed: XXXX</Card.Text>
                      <Card.Text>
                        {`First social distance restrictions: ${this.state.firstRestrictionsDate}.`}
                      </Card.Text>

                      {!this.state.lockdownDate ? null : (
                        <Card.Text>
                          {`National lockdown: ${this.state.lockdownDate}.`}
                        </Card.Text>
                      )}
                      <Card.Text>
                        {` The first wave ended: ${this.state.maximumDate}.`}
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
                      <Card.Title>Statistics</Card.Title>
                      {!this.state.totalRealCases ? null : (
                        <Card.Text>
                          {`Total COVID-19 Cases per Million: ${this.state.totalRealCases
                            .toFixed(0)
                            .toString()} \n `}
                        </Card.Text>
                      )}
                      <Card.Text>{`Total COVID-19 Deaths per Million: XXX`}</Card.Text>
                      {!this.state.country_population_density ? null : (
                        <Card.Text>
                          {`Population density (per square km): ${this.state.country_population_density
                            .toFixed(2)
                            .toString()}`}
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
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
                        value={this.state.counterfactualFirstRestrictionsDate}
                        format="dd/MM/yyyy"
                        className="form-control"
                        monthsShown={1}
                        popperPlacement="bottom"
                      />
                    </Col>
                    <Col>
                      <DatePicker
                        onChange={this.onLockdownChange}
                        value={this.state.counterfactualLockdownDate}
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
                      initialDate={this.state.initialDate}
                      maximumDate={this.state.maximumDate}
                      firstRestrictionsDate={this.state.firstRestrictionsDate}
                      lockdownDate={this.state.lockdownDate}
                      counterfactualFirstRestrictionsDate={
                        this.state.counterfactualFirstRestrictionsDate
                      }
                      counterfactualLockdownDate={
                        this.state.counterfactualLockdownDate
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
                        {`${this.state.initialDate}`} and{" "}
                        {`${this.state.maximumDate}`}.{" "}
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
                      {!this.state.totalCounterfactualCases ? null : (
                        <Card.Text>
                          {`Total COVID-19 Cases per Million: ${this.state.totalCounterfactualCases
                            .toFixed(0)
                            .toString()} \n `}
                        </Card.Text>
                      )}
                      {this.state.datesChanged === false ? null : (
                        <Card.Text>
                          {`Reduction in total cases: ${(
                            (1 -
                              this.state.totalCounterfactualCases /
                                this.state.totalRealCases) *
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
