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
import convert from "./Utils.js"

export default class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
    };
  }

  async loadCasesData() {
    console.log("Fetching case data");

    // if there is not an available start or end date in the data use this default ones
    const initial_date =
      this.props.initial_date != null ? this.props.initial_date : "2020-02-20";
    const maximum_date =
      this.props.maximum_date != null ? this.props.maximum_date : "2020-06-23";

    // converting DateFields that come from the DatePicker to string. If there is no
    // counterfactual date use the default historical one
    const counterfactual_first_restrictions_date =
      this.props.counterfactual_first_restrictions_date != null
        ? convert(this.props.counterfactual_first_restrictions_date)
        : this.props.first_restrictions_date;
    const counterfactual_lockdown_date =
      this.props.counterfactual_lockdown_date != null
        ? convert(this.props.counterfactual_lockdown_date)
        : this.props.lockdown_date;

    // Retrieve real and counterfactual data in parallel
    const task = new LoadDailyCasesTask();
    let [casesCounterfactual, casesReal] = await Promise.all([
      task.getCounterfactualCovidCases(
        this.props.isoCode,
        initial_date,
        maximum_date,
        counterfactual_first_restrictions_date,
        counterfactual_lockdown_date
      ),
      task.getRealCovidCases(this.props.isoCode, initial_date, maximum_date),
    ]);

    // Combine the two datasets into a single data array
    let casesData = [];

    if (casesCounterfactual.length != 0) {
      for (let i = 0; i < casesReal.length; i++) {
        const counterfactual = casesCounterfactual.find(
          (counterfactual) => counterfactual.date === casesReal[i].date
        );
        let record = {
          date: casesReal[i].date,
          weekly_avg_real: casesReal[i].summed_avg_cases_per_million,
          weekly_avg_counterfactual:
            counterfactual.summed_avg_cases_per_million,
        };
        casesData.push(record);
      }
      this.setState({ casesData: casesData });
    }
    // Set the component state to trigger a re-render
  }

  async componentDidMount() {
    await this.loadCasesData();
  }

  async componentDidUpdate(prevProps) {
    // if click in new country reload case data
    if (this.props.isoCode !== prevProps.isoCode) {
      await this.loadCasesData();
    }

    // if counterfactual first restriction date is changed reload case data
    if (
      this.props.counterfactual_first_restrictions_date !==
      prevProps.counterfactual_first_restrictions_date
    ) {
      await this.loadCasesData();
    }
    // if counterfactual lockdown date is changed reload case data
    if (
      this.props.counterfactual_lockdown_date !==
      prevProps.counterfactual_lockdown_date
    ) {
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
              {this.props.first_restrictions_date != null && (
                <ReferenceLine
                  x={this.props.first_restrictions_date}
                  label={{
                    position: "left",
                    value: "First Restrictions",
                    fontSize: 12,
                  }}
                  strokeDasharray="5 5"
                />
              )}
              {this.props.lockdown_date != null && (
                <ReferenceLine
                  x={this.props.lockdown_date}
                  label={{ position: "right", value: "Lockdown", fontSize: 12 }}
                  strokeDasharray="5 5"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}

