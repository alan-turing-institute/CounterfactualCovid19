import exact from "prop-types-exact";
import legendItems from "../entities/LegendItems";
import styles from "../css/Legend.module.css";

const propTypes = exact({});

const defaultProps = {};

const Legend = () => {
  const legendItemsReverse = [...legendItems].reverse();
  return (
    <div className={styles.stretch_column}>
      {legendItemsReverse.map((item) => (
        <div
          className={styles.entry}
          key={item.title}
          style={{
            backgroundColor: item.color,
            color: item.textColor != null ? item.textColor : "black",
          }}
        >
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = propTypes;
Legend.defaultProps = defaultProps;

export default Legend;
