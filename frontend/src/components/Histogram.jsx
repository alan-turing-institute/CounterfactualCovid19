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
import convert from "./Utils.js";

export default class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
    };
  }

  async loadCasesData() {
    console.log("Updating histogram data");

    // if there is not an available start or end date in the data use this default ones
    const dateInit =
      this.props.initialDate != null ? this.props.initialDate : "2020-02-20";
    const dateMaxim =
      this.props.maximumDate != null ? this.props.maximumDate : "2020-06-23";

    // converting DateFields that come from the DatePicker to string. If there is no
    // counterfactual date use the default historical one
    const counterfactualDateFirstRestrictions =
      this.props.counterfactualFirstRestrictionsDate != null
        ? convert(this.props.counterfactualFirstRestrictionsDate)
        : this.props.firstRestrictionsDate;
    const counterfactualDateLockdown =
      this.props.counterfactualLockdownDate != null
        ? convert(this.props.counterfactualLockdownDate)
        : this.props.lockdownDate;

    // Retrieve real and counterfactual data in parallel
    const task = new LoadDailyCasesTask();
    let [casesCounterfactual, casesReal] = await Promise.all([
      task.getCounterfactualCovidCases(
        this.props.isoCode,
        dateInit,
        dateMaxim,
        counterfactualDateFirstRestrictions,
        counterfactualDateLockdown
      ),
      task.getRealCovidCases(this.props.isoCode, dateInit, dateMaxim),
    ]);

    // Combine the two datasets into a single data array
    let casesData = [];

    if (casesCounterfactual.length !== 0) {
      for (let i = 0; i < casesReal.length; i++) {
        const counterfactual = casesCounterfactual.find(
          (counterfactual) => counterfactual.date === casesReal[i].date
        );
        let record = {
          date: casesReal[i].date,
          casesReal: casesReal[i].summed_avg_cases_per_million,
          casesCounterfactual: counterfactual.summed_avg_cases_per_million,
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
      this.props.counterfactualFirstRestrictionsDate !==
      prevProps.counterfactualFirstRestrictionsDate
    ) {
      await this.loadCasesData();
    }
    // if counterfactual lockdown date is changed reload case data
    if (
      this.props.counterfactualLockdownDate !==
      prevProps.counterfactualLockdownDate
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
              <Bar dataKey="casesReal" fill="#413ea0" />
              <Line
                type="monotone"
                dataKey="casesCounterfactual"
                stroke="#ff7300"
              />
              {this.props.firstRestrictionsDate != null && (
                <ReferenceLine
                  x={this.props.firstRestrictionsDate}
                  label={{
                    position: "left",
                    value: "First Restrictions",
                    fontSize: 12,
                  }}
                  strokeDasharray="5 5"
                />
              )}
              {this.props.lockdownDate != null && (
                <ReferenceLine
                  x={this.props.lockdownDate}
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
