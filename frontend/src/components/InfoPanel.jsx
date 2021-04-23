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

     this.onFirstRestrictionsChange = this.onFirstRestrictionsChange.bind(this);
     this.onLockdownChange = this.onLockdownChange.bind(this);

  }

  async loadRestrictionData(updateCounterfactual) {
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

      if (updateCounterfactual){
        this.setState({
        counterfactual_first_restrictions_date: new Date(this.state.first_restrictions_date),
      });
      this.setState({ counterfactual_lockdown_date: new Date(this.state.lockdown_date)});
      }

      this.setState({updateHistogram: true})

    }
  }

  async componentDidMount() {
    await this.loadRestrictionData(true);
  }

  async componentDidUpdate(prevProps) {

    console.log('Updated something')
    console.log(this.props)
    console.log(this.state)

    if (this.props.isoCode !== prevProps.isoCode) {
      this.setState({ first_restrictions_date: null });
      this.setState({ lockdown_date: null });
      this.setState({ initial_date: null });
      this.setState({ maximum_date: null });
      this.setState({updateHistogram: false})


      await this.loadRestrictionData(true);

    }

  }



    onFirstRestrictionsChange(new_date){
        this.setState({updateHistogram: false})
        this.setState({ counterfactual_first_restrictions_date: new_date});
        this.setState({updateHistogram: true})

    }
    onLockdownChange(new_date){
        this.setState({updateHistogram: false})
        this.setState({ counterfactual_lockdown_date: new_date});
        this.setState({updateHistogram: true})

        console.log(new_date)
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
                        onChange={this.onFirstRestrictionsChange}
                        value={this.state.counterfactual_first_restrictions_date}
                      />
                    </Col>
                    <Col>
                      <DatePicker
                        onChange={this.onLockdownChange}
                        value={this.state.counterfactual_lockdown_date}
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
                      first_restrictions_date={this.state.first_restrictions_date}
                      lockdown_date={this.state.lockdown_date}
                      counterfactual_first_restrictions_date={this.state.counterfactual_first_restrictions_date}
                      counterfactual_lockdown_date={this.state.counterfactual_lockdown_date}

                    />
                  </Row>
                )}
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
