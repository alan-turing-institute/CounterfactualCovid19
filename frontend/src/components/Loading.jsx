import exact from "prop-types-exact";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import styles from "../css/Loading.module.css";

const propTypes = exact({});

const defaultProps = {};

const Loading = () => {
  return (
    <Row className={`${styles.spinners} flex-grow-1`}>
      <Spinner animation="grow" variant="success" role="status" />
      <Spinner animation="grow" variant="danger" role="status" />
      <Spinner animation="grow" variant="info" role="status" />
    </Row>
  );
};

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
