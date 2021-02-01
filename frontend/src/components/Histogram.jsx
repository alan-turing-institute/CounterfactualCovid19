import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import LoadDailyCasesTask from "../tasks/LoadDailyCasesTask";

export default class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.isoCode !== prevProps.isoCode) {
      // Retrieve real and counterfactual data in parallel
      const task = new LoadDailyCasesTask();
      let [casesReal, casesCounterfactual] = await Promise.all([
        task.getRealCovidCases(this.props.isoCode),
        task.getCounterfactualCovidCases(this.props.isoCode),
      ]);
      // Combine the two datasets into a single data array
      let casesData = [];
      for (let i = 0; i < casesReal.length; i++) {
        const counterfactual = casesCounterfactual.find(
          (counterfactual) => counterfactual.date === casesReal[i].date
        );
        let record = {
          date: casesReal[i].date,
          weekly_avg_real: casesReal[i].weekly_avg_cases_per_million,
          weekly_avg_counterfactual: counterfactual.weekly_avg_cases_per_million,
        };
        casesData.push(record);
      }
      // Set the component state to trigger a re-render
      this.setState({ casesData: casesData });
    }
  }

  render() {
    return (
      <div>
        {!(this.props.isoCode && this.state.casesData.length > 0) ? (
          <Card
            bg={"dark"}
            style={{ marginTop: 5, marginBottom: 5 }}
            text={"light"}
          >
            <Card.Body>
              <Card.Text>Select a country</Card.Text>
            </Card.Body>
          </Card>
        ) : (
          <Container fluid>
            <Row>
              <Col style={{ width: "33vw" }}>
                <Card
                  style={{ width: "18rem", marginTop: 50, marginBottom: 50 }}
                  bg={"light"}
                >
                  <Card.Body>
                    <Card.Title>{`${this.props.isoCode}`}</Card.Title>
                    <Card.Text>
                      {`Total Cases per Million: ${this.props.summedAvgCases
                        .toFixed(2)
                        .toString()}`}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col style={{ width: "33vw" }}>
                <ComposedChart
                  data={this.state.casesData}
                  width={500}
                  height={350}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="weekly_avg_real" fill="#413ea0" />
                  <Line
                    type="monotone"
                    dataKey="weekly_avg_counterfactual"
                    stroke="#ff7300"
                  />
                </ComposedChart>
              </Col>
              <Col style={{ width: "33vw" }}>
                <Card
                  style={{ width: "18rem", marginTop: 50, marginBottom: 50 }}
                  bg={"light"}
                >
                  <Card.Text>
                    Any other cases_real/information we might want to add in
                    here.
                  </Card.Text>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
