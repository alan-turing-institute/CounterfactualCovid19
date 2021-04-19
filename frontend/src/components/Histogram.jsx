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
import LoadRestrictionsDatesTask from "../tasks/LoadRestrictionsDatesTask.js";

export default class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
      first_restrictions_date: null,
      lockdown_date: null,
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
        weekly_avg_real: casesReal[i].summed_avg_cases_per_million,
        weekly_avg_counterfactual: counterfactual.summed_avg_cases_per_million,
      };
      casesData.push(record);
    }
    // Set the component state to trigger a re-render
    this.setState({ casesData: casesData });
  }

  async loadRestrictionData() {
    // Retrieve Restriction data
    const task = new LoadRestrictionsDatesTask();
    let [restrictionsDates] = await Promise.all([
      task.getCountryRestrictionDates(this.props.isoCode),
    ]);

    console.log("Loading restriction dates");
    console.log(restrictionsDates[0]);
    console.log(restrictionsDates[0].first_restrictions_date);

    // Set the component state to trigger a re-render
    this.setState({
      first_restrictions_date: restrictionsDates[0].first_restrictions_date,
    });
    this.setState({ lockdown_date: restrictionsDates[0].lockdown_date });
  }

  async componentDidMount() {
    await this.loadCasesData();
    await this.loadRestrictionData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      await this.loadCasesData();
      await this.loadRestrictionData();
    }
  }

  render() {
    console.log("Printing state first restrictions");
    console.log(this.state.first_restrictions_date);
    console.log(this.state.lockdown_date);
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
              <ReferenceLine
                x={this.state.first_restrictions_date}
                label={{
                  position: "left",
                  value: "First Restrictions",
                  fontSize: 12,
                }}
                strokeDasharray="5 5"
              />
              <ReferenceLine
                x={this.state.lockdown_date}
                label={{ position: "right", value: "Lockdown", fontSize: 12 }}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}
