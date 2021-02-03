import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "./Loading";
import LoadDailyCasesTask from "../tasks/LoadDailyCasesTask";

export default class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
    };
  }

  async loadCasesData() {
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

  async componentDidMount() {
    await this.loadCasesData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      await this.loadCasesData();
    }
  }

  render() {
    return (
      <div
        style={{
          height: this.props.height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {this.state.casesData.length === 0 ? (
          <Loading />
        ) : (
          <ResponsiveContainer height="95%">
            <ComposedChart data={this.state.casesData}>
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
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}
