// import Histogram from "./Histogram";
import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Histogram from "./Histogram";
import MyDatesPicker from "./MyDatesPicker";

export default class InfoPanel extends React.Component {
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
                      The first wave for {`${this.props.countryName}`} happened between X and X date.
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
                    <Card.Text>
                      {`Total Deaths per Million: XXX`}
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Row>
              </Col>
              <Col xs={6} md={6} lg={6}>
               <Row  xs={1} md={1} lg={1}>
                <MyDatesPicker/>
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
                    <Card.Text>
                      XXX Density
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
                    <Card.Title>XXX</Card.Title>
                    <Card.Text>
                      XXX
                    </Card.Text>
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
