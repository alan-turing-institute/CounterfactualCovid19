import Card from "react-bootstrap/Card";

const CounterfactualStatistics = (props) => {
  return (
    <Card
      style={{
        marginTop: "1%",
        marginBottom: "1%",
      }}
      bg={"light"}
    >
      <Card.Body>
        <Card.Title>Counterfactual Statistics</Card.Title>
        {!props.totalCasesCounterfactual ? null : (
          <Card.Text>
            {`Total COVID-19 Cases per Million: ${props.totalCasesCounterfactual
              .toFixed(0)
              .toString()} \n `}
          </Card.Text>
        )}
        {props.datesChanged === false ? null : (
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
export default CounterfactualStatistics;
