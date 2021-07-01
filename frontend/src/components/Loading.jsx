import exact from "prop-types-exact";
import Spinner from "react-bootstrap/Spinner";
import styles from "../css/Loading.module.css";

const propTypes = exact({});

const defaultProps = {};

const Loading = () => {
  return (
    <div className={styles.spinners}>
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
