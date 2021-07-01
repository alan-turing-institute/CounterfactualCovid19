import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import PropTypes from "prop-types";
import styles from "../css/Common.module.css";

const propTypes = exact({
  totalCasesCounterfactual: PropTypes.number,
  totalCasesReal: PropTypes.number,
  shiftFirstRestrictions: PropTypes.number.isRequired,
  shiftLockdown: PropTypes.number.isRequired,
});

const defaultProps = {};

const CounterfactualStatistics = (props) => {
  return (
    <Card className={styles.card} bg={"light"}>
      <Card.Body>
        <Card.Title>Counterfactual Statistics</Card.Title>
        {!props.shiftFirstRestrictions ? null : (
          <Card.Text>{`Shift in first restrictions: ${props.shiftFirstRestrictions} days`}</Card.Text>
        )}
        {!props.shiftLockdown ? null : (
          <Card.Text>{`Shift in lockdown: ${props.shiftLockdown} days`}</Card.Text>
        )}
        {!props.totalCasesCounterfactual ? null : (
          <Card.Text>
            {`Total COVID-19 Cases per Million: ${props.totalCasesCounterfactual
              .toFixed(0)
              .toString()} \n `}
          </Card.Text>
        )}
        {!(props.shiftFirstRestrictions !== 0 || props.shiftLockdown !== 0) ||
        !(props.totalCasesCounterfactual & props.totalCasesReal) ? null : (
          <Card.Text>
            {`Reduction in total cases: ${(
              (1 - props.totalCasesCounterfactual / props.totalCasesReal) *
              100
            )
              .toFixed(1)
              .toString()} %`}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

CounterfactualStatistics.propTypes = propTypes;
CounterfactualStatistics.defaultProps = defaultProps;

export default CounterfactualStatistics;
