import React, { Component } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-date-picker";
import DatePicker from 'react-date-picker';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {ResponsiveContainer} from "recharts";


export default class MyDatesPicker extends React.Component {
  state = {
    date: [new Date(), new Date()],
    dateTwo: [new Date(), new Date()],
  };

  onChange = (date) => this.setState({ date });
  onChangeTwo = (dateTwo) => this.setState({ dateTwo });

  render() {
    const { date, dateTwo } = this.state;

    return (
      <div
      style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
     <Row>
      <Col>
        <DatePicker
          onChange={this.onChange}
          value={date}
        />
       </Col>
      <Col>
        <DatePicker
          onChange={this.onChangeTwo}
          value={dateTwo}
        />
        </Col>
        </Row>
      </div>
    );
  }
}