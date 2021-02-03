// import Histogram from "./Histogram";
import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Histogram from "./Histogram";

export default class InfoPanel extends React.Component {
  render() {
    return (
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {!this.props.isoCode ? (
          <Card bg={"dark"} text={"light"} style={{ width: "100%" }}>
            <Card.Body style={{ display: "flex", justifyContent: "center" }}>
              <Card.Text>Select a country</Card.Text>
            </Card.Body>
          </Card>
        ) : (
          <Container fluid>
            <Row>
              <Col xs={4} md={3} lg={2}>
                <Card
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                  }}
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
              <Col xs={4} md={6} lg={8}>
                <Histogram
                  isoCode={this.props.isoCode}
                  height={this.props.height}
                />
              </Col>
              <Col xs={4} md={3} lg={2}>
                <Card
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                  }}
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
