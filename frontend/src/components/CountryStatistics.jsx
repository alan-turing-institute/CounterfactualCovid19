import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import PropTypes from "prop-types";

const propTypes = exact({
  totalCases: PropTypes.number,
  populationDensity: PropTypes.number,
});

const defaultProps = {};

const CountryStatistics = (props) => {
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
        {!props.totalCases ? null : (
          <Card.Text>
            {`Total COVID-19 Cases per Million: ${props.totalCases
              .toFixed(0)
              .toString()} \n `}
          </Card.Text>
        )}
        <Card.Text>{`Total COVID-19 Deaths per Million: XXX`}</Card.Text>
        {!props.populationDensity ? null : (
          <Card.Text>
            {`Population density (per square km): ${props.populationDensity
              .toFixed(2)
              .toString()}`}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};
CountryStatistics.propTypes = propTypes;
CountryStatistics.defaultProps = defaultProps;

export default CountryStatistics;
