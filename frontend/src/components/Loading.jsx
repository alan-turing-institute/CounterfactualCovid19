import "../css/Loading.css";
import exact from "prop-types-exact";
import Spinner from "react-bootstrap/Spinner";

const propTypes = exact({});

const defaultProps = {};

const Loading = () => {
  return (
    <div className="loading-spinners">
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
