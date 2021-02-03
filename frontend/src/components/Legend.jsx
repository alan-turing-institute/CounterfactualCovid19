import legendItems from "../entities/LegendItems";

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
            flex: 1,
            display: "flex",
            alignItems: "center", // vertical
            justifyContent: "center", // horiztontal
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

export default Legend;
