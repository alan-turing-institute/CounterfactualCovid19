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
  ReferenceLine,
} from "recharts";
import Loading from "./Loading";
import LoadDailyCasesTask from "../tasks/LoadDailyCasesTask";

export default class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
      first_restrictions_date: this.props.first_restrictions_date,
      lockdown_date: this.props.lockdown_date,
    };
  }

  async loadCasesData() {

    console.log('Fetching data')
    console.log(this.props)

    const initial_date = this.props.initial_date != null ? this.props.initial_date : "2020-02-20";
    const maximum_date = this.props.maximum_date != null ? this.props.maximum_date : "2020-06-23";

    // Retrieve real and counterfactual data in parallel
    const task = new LoadDailyCasesTask();
    let [casesReal, casesCounterfactual] = await Promise.all([
      task.getCounterfactualCovidCases(this.props.isoCode, initial_date, maximum_date,this.props.first_restrictions_date, this.props.lockdown_date),
      task.getRealCovidCases(this.props.isoCode, initial_date, maximum_date),
    ]);

    console.log(casesReal.length)
    console.log(casesCounterfactual.length)

    // Combine the two datasets into a single data array
    let casesData = [];
    for (let i = 0; i < casesReal.length; i++) {
      const counterfactual = casesCounterfactual.find(
        (counterfactual) => counterfactual.date === casesReal[i].date
      );
      let record = {
        date: casesReal[i].date,
        weekly_avg_real: casesReal[i].summed_avg_cases_per_million,
        weekly_avg_counterfactual: counterfactual.summed_avg_cases_per_million,
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
          <ResponsiveContainer height="90%">
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
              if (this.state.first_restrictions_date != null){" "}
              {
                <ReferenceLine
                  x={this.state.first_restrictions_date}
                  label={{
                    position: "left",
                    value: "First Restrictions",
                    fontSize: 12,
                  }}
                  strokeDasharray="5 5"
                />
              }
              if (this.state.first_restrictions_date != null){" "}
              {
                <ReferenceLine
                  x={this.state.lockdown_date}
                  label={{ position: "right", value: "Lockdown", fontSize: 12 }}
                  strokeDasharray="5 5"
                />
              }
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}
