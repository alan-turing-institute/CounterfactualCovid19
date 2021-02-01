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

const cases_real = [
  {
    date: "2020-03-01",
    cases_7day_rolling_average: 590,

  },
  {
    date: "2020-03-02",
    cases_7day_rolling_average: 868,
  },
  {
    date: "2020-03-03",
    cases_7day_rolling_average: 1397,
  },
  {
    date: "2020-03-04",
    cases_7day_rolling_average: 1480,
  },
  {
    date: "2020-03-05",
    cases_7day_rolling_average: 1520,
  },
  {
    date: "2020-03-06",
    cases_7day_rolling_average: 1400,
  },
  {
    date: "2020-03-07",
    cases_7day_rolling_average: 1400,
  },
  {
    date: "2020-03-08",
    cases_7day_rolling_average: 1400,
  },
  {
    date: "2020-03-09",
    cases_7day_rolling_average: 1400,
  },
  {
    date: "2020-03-10",
    cases_7day_rolling_average: 1400,
  },
];

const cases_counterfactual = [
  {
    date: "2020-03-01",
    cases_7day_rolling_average: 590,
  },
  {
    date: "2020-03-02",
    cases_7day_rolling_average: 868,
  },
  {
    date: "2020-03-03",
    cases_7day_rolling_average: 1397,
  },
  {
    date: "2020-03-04",
    cases_7day_rolling_average: 1480,
  },
  {
    date: "2020-03-05",
    cases_7day_rolling_average: 1520,
  },
  {
    date: "2020-03-06",
    cases_7day_rolling_average: 1400,

  },
  {
    date: "2020-03-07",
    cases_7day_rolling_average: 1400,

  },
  {
    date: "2020-03-08",
    cases_7day_rolling_average: 1400,
  },
  {
    date: "2020-03-09",
    cases_7day_rolling_average: 1400,
  },
  {
    date: "2020-03-10",
    cases_7day_rolling_average: 1400,
  },
];

export default class Histogram extends React.Component {
  render() {
    return (
      <div>
        {!this.props.selectedCountry ? (
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
                    <Card.Title>{`${this.props.selectedCountry}`}</Card.Title>
                    <Card.Text>
                      {`Total Cases per Million: ${this.props.selectedCaseNumber}`}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col style={{ width: "33vw" }}>
                <ComposedChart
                  width={500}
                  height={350}
                  data={cases_real}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis cases_realKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar cases_realKey="amt" fill="#413ea0" />
                  <Line
                    data={cases_counterfactual}
                    type="monotone"
                    cases_realKey="amt"
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
                    Any other cases_real/information we might want to add in here.
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
