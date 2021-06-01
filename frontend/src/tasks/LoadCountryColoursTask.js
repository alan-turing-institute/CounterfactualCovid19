import legendItems from "../entities/LegendItems";

const applyCountryColours = (countryGeoms, integratedCasesData) => {
  try {
    console.log(
      `Determining colour scheme for ${countryGeoms.length} countries...`
    );
    console.log("%O", integratedCasesData);
    for (let i = 0; i < countryGeoms.length; i++) {
      // Find matching country
      const countryGeom = countryGeoms[i];
      const countryData = integratedCasesData.find(
        (countryData) => countryGeom.id === countryData.iso_code
      );
      // Use total cases per million to determine colour
      const totalCases = countryData
        ? Number(countryData.summed_avg_cases_per_million)
        : 0;
      const legendItem = legendItems.find((item) => item.isFor(totalCases));
      if (legendItem) {
        countryGeom.properties.color = legendItem.color;
      }
    }
    return countryGeoms;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default applyCountryColours;
