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
import Col from "react-bootstrap/Col";
import exact from "prop-types-exact";
import LoadDailyCasesTask from "../tasks/LoadDailyCasesTask";
import Loading from "./Loading";
import pDebounce from "p-debounce";
import PropTypes from "prop-types";
import React from "react";
import commonStyles from "../css/Common.module.css";
import localStyles from "../css/Histogram.module.css";

const propTypes = exact({
  dateFinal: PropTypes.string,
  dateFirstRestrictionsCounterfactual: PropTypes.string,
  dateFirstRestrictionsReal: PropTypes.string,
  dateInitial: PropTypes.string,
  dateLockdownCounterfactual: PropTypes.string,
  dateLockdownReal: PropTypes.string,
  isoCode: PropTypes.string.isRequired,
});

const defaultProps = {};

const styles = { ...commonStyles, ...localStyles };

class Histogram extends React.PureComponent {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      casesData: [],
    };
  }

  async loadCasesData() {
    // Retrieve real and counterfactual data in parallel
    console.log(
      `Loading real and counterfactual cases between ${this.props.dateInitial} and ${this.props.dateFinal}`
    );
    const task = new LoadDailyCasesTask();
    const [casesCounterfactual, casesReal] = await Promise.all([
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
        const record = {
          date: casesReal[i].date,
          "Real cases": casesReal[i].summed_avg_cases_per_million,
          "Counterfactual cases": counterfactual.summed_avg_cases_per_million || 0,
        };
        casesData.push(record);
      }
      this.setState({ casesData: casesData });
    }
  }

  // Delay for 500ms before returning in order to catch multiple calls in quick succession
  debouncedLoadCasesData = pDebounce(this.loadCasesData, 500);

  // This runs whenever the props or state change
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
      return this.debouncedLoadCasesData();
    }
  }

  render() {
    if (this.state.casesData.length === 0) {
      return (
        <Col xs={12} className={styles.loading}>
          <Loading />
        </Col>
      );
    }
    // Set the x-axis and y-axis offsets based on the current window size
    console.debug("Redrawing histogram...");
    const axisOffsetHorizontal = 0.03 * window.innerWidth;
    const axisOffsetVertical = 0.03 * window.innerHeight;
    return (
      <ResponsiveContainer width="100%" aspect={2}>
        <ComposedChart data={this.state.casesData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" height={axisOffsetVertical} />
          <YAxis width={axisOffsetHorizontal}/>
          <Tooltip />
          <Legend align="center"/>
          <Bar dataKey="Real cases" fill="#413ea0" />
          <Line
            type="monotone"
            dataKey="Counterfactual cases"
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
    );
  }
}

Histogram.propTypes = propTypes;
Histogram.defaultProps = defaultProps;

export default Histogram;
