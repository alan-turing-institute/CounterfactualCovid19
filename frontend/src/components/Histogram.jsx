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
import exact from "prop-types-exact";
import LoadDailyCasesTask from "../tasks/LoadDailyCasesTask";
import Loading from "./Loading";
import PropTypes from "prop-types";
import React from "react";

const propTypes = exact({
  dateFinal: PropTypes.string,
  dateFirstRestrictionsCounterfactual: PropTypes.string,
  dateFirstRestrictionsReal: PropTypes.string,
  dateInitial: PropTypes.string,
  dateLockdownCounterfactual: PropTypes.string,
  dateLockdownReal: PropTypes.string,
  height: PropTypes.string.isRequired,
  isoCode: PropTypes.string.isRequired,
});

const defaultProps = {};

class Histogram extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
    };
  }

  async loadCasesData() {
    console.log("Loading real and counterfactual cases");
    // Retrieve real and counterfactual data in parallel
    const task = new LoadDailyCasesTask();
    let [casesCounterfactual, casesReal] = await Promise.all([
      task.getCounterfactualCovidCases(
        this.props.isoCode,
        this.props.dateInitial,
        this.props.dateFinal,
        this.props.dateFirstRestrictionsCounterfactual,
        this.props.dateLockdownCounterfactual
      ),
      task.getRealCovidCases(
        this.props.isoCode,
        this.props.dateInitial,
        this.props.dateFinal
      ),
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
  }

  async componentDidMount() {
    await this.loadCasesData();
  }

  async componentDidUpdate(prevProps) {
    // Reload case data whenever
    // 1. A new country is selected
    // 2. The counterfactual first restriction date is changed
    // 3. The counterfactual lockdown date is changed
    if (
      this.props.isoCode !== prevProps.isoCode ||
      this.props.dateFirstRestrictionsCounterfactual !==
        prevProps.dateFirstRestrictionsCounterfactual ||
      this.props.dateLockdownCounterfactual !==
        prevProps.dateLockdownCounterfactual
    ) {
      await this.loadCasesData();
    }
  }

  render() {
    console.log("Redrawing histogram...");
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
              {this.props.dateFirstRestrictionsReal != null && (
                <ReferenceLine
                  x={this.props.dateFirstRestrictionsReal}
                  label={{
                    position: "left",
                    value: "First Restrictions",
                    fontSize: 12,
                  }}
                  strokeDasharray="5 5"
                />
              )}
              {this.props.dateLockdownReal != null && (
                <ReferenceLine
                  x={this.props.dateLockdownReal}
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

Histogram.propTypes = propTypes;
Histogram.defaultProps = defaultProps;

export default Histogram;
