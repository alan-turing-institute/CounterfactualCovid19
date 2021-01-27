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

const data = [
  {
    name: "2020-03-01",
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490,
  },
  {
    name: "2020-03-02",
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: "2020-03-03",
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: "2020-03-04",
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: "2020-03-05",
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: "2020-03-06",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-07",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-08",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-09",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-10",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
];

const data1 = [
  {
    name: "2020-03-01",
    uv: 590,
    pv: 800,
    amt: 1200,
    cnt: 490,
  },
  {
    name: "2020-03-02",
    uv: 868,
    pv: 967,
    amt: 1306,
    cnt: 590,
  },
  {
    name: "2020-03-03",
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: "2020-03-04",
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: "2020-03-05",
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: "2020-03-06",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-07",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-08",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-09",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
  {
    name: "2020-03-10",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
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
                  data={data}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amt" fill="#413ea0" />
                  <Line
                    data={data1}
                    type="monotone"
                    dataKey="amt"
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
                    Any other data/information we might want to add in here.
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
