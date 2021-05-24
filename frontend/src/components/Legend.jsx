import legendItems from "../entities/LegendItems";

const propTypes = exact({});

const defaultProps = {};

const Legend = () => {
  const legendItemsReverse = [...legendItems].reverse();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        height: "100%",
      }}
    >
      {legendItemsReverse.map((item) => (
        <div
          key={item.title}
          style={{
            backgroundColor: item.color,
            display: "flex",
            flex: 1,
            alignItems: "center", // vertical
            justifyContent: "center", // horizontal
            color: item.textColor != null ? item.textColor : "black",
            fontWeight: "bolder",
            fontSize: "x-small",
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
