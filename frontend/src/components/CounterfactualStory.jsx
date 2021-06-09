import Card from "react-bootstrap/Card";
import exact from "prop-types-exact";
import PropTypes from "prop-types";

const propTypes = exact({
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string,
});

const defaultProps = {};

const CounterfactualStory = (props) => {
  return (
    <Card
      style={{
        marginTop: "1%",
        marginBottom: "1%",
      }}
      bg={"light"}
    >
      <Card.Body>
        <Card.Title>Counterfactual story</Card.Title>
        <Card.Text>
          Use the calendars to select counterfactual dates for first social
          distance restrictions (left) and/or lockdown (right).
        </Card.Text>
        {!props.dateStart && !props.dateEnd ? null : (
          <Card.Text>
            {`The spread of COVID-19 was simulated between ${props.dateStart} and ${props.dateEnd}.`}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

CounterfactualStory.propTypes = propTypes;
CounterfactualStory.defaultProps = defaultProps;

export default CounterfactualStory;
