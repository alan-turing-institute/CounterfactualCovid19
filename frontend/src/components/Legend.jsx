import "../css/Legend.css";
import exact from "prop-types-exact";
import legendItems from "../entities/LegendItems";

const propTypes = exact({});

const defaultProps = {};

const Legend = () => {
  const legendItemsReverse = [...legendItems].reverse();
  return (
    <div className="legend-flex-column"
    >
      {legendItemsReverse.map((item) => (
        <div className="legend-entry"
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
