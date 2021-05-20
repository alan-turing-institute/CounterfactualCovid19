import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import PropTypes from "prop-types";

const CountryDates = (props) => {
  return (
    <Card
      style={{
        marginTop: "1%",
        marginBottom: "1%",
      }}
      bg={"light"}
    >
      <Card.Body>
        <Card.Title>{`${props.countryName ? props.countryName : 'Unknown'}`}</Card.Title>
        {!props.dateFirstWaveStart ? null : (
          <Card.Text>{`First case confirmed: ${props.dateFirstWaveStart}.`}</Card.Text>
        )}
        {!props.dateFirstRestrictions ? null : (
          <Card.Text>{`First social distance restrictions: ${props.dateFirstRestrictions}.`}</Card.Text>
        )}
        {!props.dateLockdown ? null : (
          <Card.Text>{`National lockdown: ${props.dateLockdown}.`}</Card.Text>
        )}
        {!props.dateFirstWaveEnd ? null : (
          <Card.Text>{` The first wave ended: ${props.dateFirstWaveEnd}.`}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};
export default CountryDates;

CountryDates.propTypes = exact({
  countryName: PropTypes.string,
  dateFirstRestrictions: PropTypes.string,
  dateFirstWaveEnd: PropTypes.string,
  dateFirstWaveStart: PropTypes.string,
  dateLockdown: PropTypes.string,
});
