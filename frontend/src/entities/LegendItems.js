import LegendItem from "./LegendItem";

var legendItems = [
  new LegendItem("10000 +", "#253494", (cases) => cases >= 10000, "white"),

  new LegendItem(
    "5000 - 9999",
    "#2c7fb8",
    (cases) => cases >= 5000 && cases < 10000,
    "White"
  ),

  new LegendItem(
    "1000 - 4999",
    "#41b6c4",
    (cases) => cases >= 1000 && cases < 5000
  ),

  new LegendItem(
    "500 - 999",
    "#a1dab4",
    (cases) => cases >= 500 && cases < 1000
  ),

  new LegendItem("0 - 499", "#ffffcc", (cases) => cases > 0 && cases < 500),

  new LegendItem("No Data", "#D6DBDF", (cases) => true),
];

export default legendItems;
