import Card from "react-bootstrap/Card";

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
        <Card.Title>{`${props.countryName}`}</Card.Title>
        <Card.Text>{`First case confirmed: ${props.dateFirstWaveStart}.`}</Card.Text>
        <Card.Text>
          {`First social distance restrictions: ${props.dateFirstRestrictions}.`}
        </Card.Text>
        {!props.dateLockdown ? null : (
          <Card.Text>{`National lockdown: ${props.dateLockdown}.`}</Card.Text>
        )}
        <Card.Text>
          {` The first wave ended: ${props.dateFirstWaveEnd}.`}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
export default CountryDates;
