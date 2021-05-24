import Spinner from "react-bootstrap/Spinner";

const propTypes = exact({});

const defaultProps = {};

const Loading = () => {
  const loadingStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div style={loadingStyle}>
      <Spinner animation="grow" variant="success" role="status">
        <span className="sr-only"></span>
      </Spinner>
      <Spinner animation="grow" variant="danger" role="status">
        <span className="sr-only"></span>
      </Spinner>
      <Spinner animation="grow" variant="info" role="status">
        <span className="sr-only"></span>
      </Spinner>
    </div>
  );
};

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
