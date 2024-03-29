import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import PropTypes from "prop-types";
import React from "react";
import styles from "../css/Common.module.css";

const propTypes = exact({
  countryName: PropTypes.string,
  dateFirstWaveEnd: PropTypes.string,
  dateFirstWaveStart: PropTypes.string,
  dateFirstRestrictions: PropTypes.string,
  dateLockdown: PropTypes.string,
});

const defaultProps = {};

const CountryDates = (props) => {
  return (
    <Card className={styles.card} bg={"light"}>
      <Card.Body>
        <Card.Title>
          {`${props.countryName ? props.countryName : "Unknown"}`}
        </Card.Title>
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
          <Card.Text>{`First wave ended: ${props.dateFirstWaveEnd}.`}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

CountryDates.propTypes = propTypes;
CountryDates.defaultProps = defaultProps;

export default CountryDates;
