import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default class Histogram extends React.Component {
  render() {
    return <div>{this.props.selectedCountry}</div>;
  }
}
