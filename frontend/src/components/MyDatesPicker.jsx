import React, { Component } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-date-picker";

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
      <div>
        <DatePicker onChange={this.onChange} value={date} />
        <DatePicker onChange={this.onChangeTwo} value={dateTwo} />
      </div>
    );
  }
}
