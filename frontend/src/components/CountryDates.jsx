import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import loadCountryDemographicsTask from "../tasks/LoadCountryDemographicTask.js";
import loadRealDatesTask from "../tasks/LoadRealDatesTask.js";
import PropTypes from "prop-types";
import React from "react";

const propTypes = exact({
  isoCode: PropTypes.string.isRequired,
});

const defaultProps = {};

class CountryDates extends React.PureComponent {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      countryName: null,
      dateFirstWaveEnd: null,
      dateFirstWaveStart: null,
      dateFirstRestrictions: null,
      dateLockdown: null,
    };
  }

  async loadDemographicData() {
    // Retrieve demographic data
    const demographics = await loadCountryDemographicsTask(this.props.isoCode);
    const realDates = await loadRealDatesTask(this.props.isoCode);
    this.setState({
      countryName: demographics.name,
      dateFirstWaveStart: realDates.first_case_date,
      dateFirstWaveEnd: realDates.maximum_date,
      dateFirstRestrictions: realDates.first_restrictions_date,
      dateLockdown: realDates.lockdown_date,
    });
  }

  componentDidMount() {
    this.loadDemographicData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isoCode !== prevProps.isoCode) {
      this.loadDemographicData();
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
          <Card.Title>
            {`${this.state.countryName ? this.state.countryName : "Unknown"}`}
          </Card.Title>
          {!this.state.dateFirstWaveStart ? null : (
            <Card.Text>{`First case confirmed: ${this.state.dateFirstWaveStart}.`}</Card.Text>
          )}
          {!this.state.dateFirstRestrictions ? null : (
            <Card.Text>{`First social distance restrictions: ${this.state.dateFirstRestrictions}.`}</Card.Text>
          )}
          {!this.state.dateLockdown ? null : (
            <Card.Text>{`National lockdown: ${this.state.dateLockdown}.`}</Card.Text>
          )}
          {!this.state.dateFirstWaveEnd ? null : (
            <Card.Text>{` The first wave ended: ${this.state.dateFirstWaveEnd}.`}</Card.Text>
          )}
        </Card.Body>
      </Card>
    );
  }
}

CountryDates.propTypes = propTypes;
CountryDates.defaultProps = defaultProps;

export default CountryDates;
