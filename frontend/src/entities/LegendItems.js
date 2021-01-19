import LegendItem from "./LegendItem";

var legendItems = [
  new LegendItem(
    "10000 +",
    "#741f1f",
    // "#8b0000",
    (cases) => cases >= 10000,
    "white"
  ),

  new LegendItem(
    "5000 - 9999",
    // "#741f1f",
    "#9c2929",
    (cases) => cases >= 5000 && cases < 10000,
    "White"
  ),

  new LegendItem(
    "1000 - 4999",
    "#c57f7f",
    (cases) => cases >= 1000 && cases < 5000
  ),

  new LegendItem(
    "500 - 999",
    "#d8aaaa",
    (cases) => cases >= 500 && cases < 1000
  ),

  new LegendItem(
    "0 - 499",
    "#ebd4d4",
    (cases) => cases > 0 && cases < 500
  ),

  new LegendItem("No Data", "#808080", (cases) => true),
];

export default legendItems;

