import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import loadCountryDemographicsTask from "../tasks/LoadCountryDemographicTask.js";
import LoadPerCountryStatisticsTask from "../tasks/LoadPerCountryStatisticsTask.js";
import PropTypes from "prop-types";
import React from "react";

const propTypes = exact({
  isoCode: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  onDataChange: PropTypes.func.isRequired,
});

const defaultProps = {};

class CountryStatistics extends React.PureComponent {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      populationDensity: null,
      totalCases: null,
      totalDeaths: null,
    };
  }

  async loadStatisticsReal() {
    // Retrieve demographic data
    const demographics = await loadCountryDemographicsTask(this.props.isoCode);
    const statistics = new LoadPerCountryStatisticsTask();
    try {
      const realCases = await statistics.loadIntegratedCases(
        this.props.isoCode,
        this.props.dateEnd
      );
      const realDeaths = await statistics.loadIntegratedDeaths(
        this.props.isoCode,
        this.props.dateEnd
      );
      // Update state and pass values back to callback function
      this.setState({
        totalCases: realCases.summed_avg_cases_per_million,
        totalDeaths: realDeaths.summed_avg_deaths_per_million,
        populationDensity: demographics.population_density,
      });
      this.props.onDataChange(
        realCases.summed_avg_cases_per_million,
        realDeaths.summed_avg_deaths_per_million
      );
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.loadStatisticsReal();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      this.loadStatisticsReal();
    }
  }

  render() {
    return (
      <Card
        style={{
          marginTop: "1%",
          marginBottom: "1%",
        }}
        bg={"light"}
      >
        <Card.Body>
          <Card.Title>Statistics</Card.Title>
          {!this.state.totalCases ? null : (
            <Card.Text>
              {`Total COVID-19 Cases per Million: ${this.state.totalCases
                .toFixed(0)
                .toString()} \n `}
            </Card.Text>
          )}
          {!this.state.totalDeaths ? null : (
            <Card.Text>
              {`Total COVID-19 Deaths per Million: ${this.state.totalDeaths
                .toFixed(0)
                .toString()}`}
            </Card.Text>
          )}
          {!this.state.populationDensity ? null : (
            <Card.Text>
              {`Population density (per square km): ${this.state.populationDensity
                .toFixed(2)
                .toString()}`}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    );
  }
}
CountryStatistics.propTypes = propTypes;
CountryStatistics.defaultProps = defaultProps;

export default CountryStatistics;
