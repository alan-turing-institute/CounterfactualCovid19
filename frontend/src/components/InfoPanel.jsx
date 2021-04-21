// import Histogram from "./Histogram";
import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Histogram from "./Histogram";
//import MyDatesPicker from "./MyDatesPicker";
import LoadRestrictionsDatesTask from "../tasks/LoadRestrictionsDatesTask.js";
import DatePicker from "react-date-picker";

export default class InfoPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_restrictions_date: null,
      lockdown_date: null,
      initial_date: null,
      maximum_date: null,
    };
  }

  async loadRestrictionData() {
    // Retrieve Restriction data
    const task = new LoadRestrictionsDatesTask();
    let [restrictionsDates] = await Promise.all([
      task.getCountryRestrictionDates(this.props.isoCode),
    ]);

    if ((restrictionsDates.length != 0) & (this.props.isoCode != null)) {
      // Set the component state with the restriction data
      this.setState({
        first_restrictions_date: restrictionsDates[0].first_restrictions_date,
      });
      this.setState({ lockdown_date: restrictionsDates[0].lockdown_date });
      this.setState({ initial_date: restrictionsDates[0].initial_date });
      this.setState({ maximum_date: restrictionsDates[0].maximum_date });
    }
  }

  async componentDidMount() {
    await this.loadRestrictionData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      await this.loadRestrictionData();
    }
  }

  onChange = (first_restrictions_date) =>
    this.setState({ first_restrictions_date });
  onChangeTwo = (lockdown_date) => this.setState({ lockdown_date });

  render() {
    console.log(" This state infopanel");
    console.log(this.state.first_restrictions_date);
    console.log(this.state.lockdown_date);

    return (
      <div>
        {!this.props.isoCode ? null : (
          <Container fluid>
            <Row>
              <Col xs={3} md={3} lg={3}>
                <Row xs={1} md={1} lg={1}>
                  <Card
                    style={{
                      marginTop: "5%",
                      marginBottom: "5%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>{`${this.props.countryName}`}</Card.Title>
                      <Card.Text>
                        The first wave for {`${this.props.countryName}`}{" "}
                        happened between {`${this.state.initial_date}`} and{" "}
                        {`${this.state.maximum_date}`} date.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <Card
                    style={{
                      marginTop: "5%",
                      marginBottom: "5%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>Covid-19 Statistics:</Card.Title>
                      <Card.Text>
                        {`Total Cases per Million: ${this.props.summedAvgCases
                          .toFixed(2)
                          .toString()} \n `}
                      </Card.Text>
                      <Card.Text>{`Total Deaths per Million: XXX`}</Card.Text>
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
                        onChange={this.onChange}
                        value={this.state.first_restrictions_date}
                      />
                    </Col>
                    <Col>
                      <DatePicker
                        onChange={this.onChangeTwo}
                        value={this.state.lockdown_date}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <Histogram
                    isoCode={this.props.isoCode}
                    height={this.props.height}
                  />
                </Row>
              </Col>
              <Col xs={3} md={3} lg={3}>
                <Row xs={1} md={1} lg={1}>
                  <Card
                    style={{
                      marginTop: "5%",
                      marginBottom: "5%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>Population Density</Card.Title>
                      <Card.Text>XXX Density</Card.Text>
                    </Card.Body>
                  </Card>
                </Row>
                <Row xs={1} md={1} lg={1}>
                  <Card
                    style={{
                      marginTop: "5%",
                      marginBottom: "5%",
                    }}
                    bg={"light"}
                  >
                    <Card.Body>
                      <Card.Title>XXX</Card.Title>
                      <Card.Text>XXX</Card.Text>
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
