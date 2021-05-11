import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Histogram from "./Histogram";
import LoadRestrictionsDatesTask from "../tasks/LoadRestrictionsDatesTask.js";
import DatePicker from "react-date-picker";
import Loading from "./Loading";
import "./InfoPanel.css";

export default class InfoPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_restrictions_date: null,
      lockdown_date: null,
      counterfactual_first_restrictions_date: null,
      counterfactual_lockdown_date: null,
      initial_date: null,
      maximum_date: null,
      updateHistogram: false,
    };

    // Bind the datepicker change functions to allow it to be used by other objects
    this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
    this.onLockdownChange = this.onLockdownChange.bind(this);
  }

  async loadRestrictionData() {
    // Retrieve Restriction data
    const task = new LoadRestrictionsDatesTask();
    let [restrictionsDates] = await Promise.all([
      task.getCountryRestrictionDates(this.props.isoCode),
    ]);

    if ((restrictionsDates != null) & (this.props.isoCode != null)) {
      try {
        // Set the component state with the restriction data
        this.setState({
          first_restrictions_date: restrictionsDates.first_restrictions_date,
        });
        this.setState({ lockdown_date: restrictionsDates.lockdown_date });
        this.setState({ initial_date: restrictionsDates.initial_date });
        this.setState({ maximum_date: restrictionsDates.maximum_date });

        // we only update counterfactual if we change countries
        // set them to their actual restriction dates

        if (this.state.first_restrictions_date != null) {
          // for the datepicker to work this needs to be a Date object.
          this.setState({
            counterfactual_first_restrictions_date: new Date(
              this.state.first_restrictions_date
            ),
          });
        }
        if (this.state.lockdown_date != null) {
          // for the datepicker to work this needs to be a Date object.
          this.setState({
            counterfactual_lockdown_date: new Date(this.state.lockdown_date),
          });
        }

        // set flag updateHistogram to true in order to render the histogram
        this.setState({ updateHistogram: true });
      } catch (error) {
        console.log(error);
      }
    }
  }

  // this runs when the info panel is first mounted
  async componentDidMount() {
    await this.loadRestrictionData();
  }

  // this runs when we click in a new country, reload all date information
  async componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      this.setState({ first_restrictions_date: null });
      this.setState({ lockdown_date: null });
      this.setState({ initial_date: null });
      this.setState({ maximum_date: null });
      this.setState({ counterfactual_first_restrictions_date: null });
      this.setState({ counterfactual_lockdown_date: null });
      this.setState({ updateHistogram: false });

      await this.loadRestrictionData();
    }
  }

  // this runs when we change the first restrictions counterfactual date
  onFirstRestrictionsChange(new_date) {
    // set updateHistogram to false to clean the histogram component
    this.setState({ updateHistogram: false });
    this.setState({ counterfactual_first_restrictions_date: new_date });

    // set updateHistogram to true to render the new histogram component
    // (comment from Camila: this is a bit hacky and could be improved?)
    this.setState({ updateHistogram: true });
  }

  // this runs when we change the lockdown counterfactual date
  onLockdownChange(new_date) {
    // set updateHistogram to false to clean the histogram component
    this.setState({ updateHistogram: false });
    this.setState({ counterfactual_lockdown_date: new_date });

    // set updateHistogram to true to render the new histogram component
    this.setState({ updateHistogram: true });
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
                      <Card.Title>{`${this.props.countryName}`}</Card.Title>
                      <Card.Text>First case confimed: XXXX</Card.Text>
                      <Card.Text>
                        {" "}
                        First social distance restrictions:{" "}
                        {`${this.state.first_restrictions_date}`}.
                      </Card.Text>

                      {!this.state.lockdown_date ? null : (
                        <Card.Text>
                          National lockdown: {` ${this.state.lockdown_date}`}.
                        </Card.Text>
                      )}
                      <Card.Text>
                        The first wave ended:
                        {` ${this.state.maximum_date}`}.
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
                      <Card.Text>
                        {`Total COVID-19 Cases per Million: ${this.props.summedAvgCases
                          .toFixed(0)
                          .toString()} \n `}
                      </Card.Text>
                      <Card.Text>{`Total COVID-19 Deaths per Million: XXX`}</Card.Text>
                      <Card.Text>{`Population density: XXX`}</Card.Text>
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
                        value={
                          this.state.counterfactual_first_restrictions_date
                        }
                        format="dd/MM/yyyy"
                        popperPlacement="bottom-end"
                        className="form-control"
                        monthsShown={1}
                        popperPlacement="bottom"
                      />
                    </Col>
                    <Col>
                      <DatePicker
                        onChange={this.onLockdownChange}
                        value={this.state.counterfactual_lockdown_date}
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
                      initial_date={this.state.initial_date}
                      maximum_date={this.state.maximum_date}
                      first_restrictions_date={
                        this.state.first_restrictions_date
                      }
                      lockdown_date={this.state.lockdown_date}
                      counterfactual_first_restrictions_date={
                        this.state.counterfactual_first_restrictions_date
                      }
                      counterfactual_lockdown_date={
                        this.state.counterfactual_lockdown_date
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
                        {`${this.state.initial_date}`} and{" "}
                        {`${this.state.maximum_date}`}.{" "}
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
                      <Card.Text>
                        {`Total COVID-19 Cases per Million:XXX`}
                      </Card.Text>
                      <Card.Text>{`% reduction in total cases`}</Card.Text>
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
