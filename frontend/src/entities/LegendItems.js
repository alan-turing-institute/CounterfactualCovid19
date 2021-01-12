import LegendItem from "./LegendItem";

var legendItems = [
  new LegendItem(
    "1,000,000 +",
    "#741f1f",
    // "#8b0000",
    (cases) => cases >= 1_000_000,
    "white"
  ),

  new LegendItem(
    "500,000 - 999,999",
    // "#741f1f",
    "#9c2929",
    (cases) => cases >= 500_000 && cases < 1_000_000,
    "White"
  ),

  new LegendItem(
    "200,000 - 499,999",
    "#c57f7f",
    (cases) => cases >= 200_000 && cases < 500_000
  ),

  new LegendItem(
    "50,000 - 199,999",
    "#d8aaaa",
    (cases) => cases >= 50_000 && cases < 200_000
  ),

  new LegendItem(
    "0 - 49,999",
    "#ebd4d4",
    (cases) => cases > 0 && cases < 50_000
  ),

  new LegendItem("No Data", "#808080", (cases) => true),
];

export default legendItems;

