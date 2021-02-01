import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css";

const WorldMap = ({ countries, onCountrySelect }) => {
  const mapStyle = {
    fillColor: "white",
    weight: 1,
    color: "black",
    fillOpacity: 1,
  };

  const onEachCountry = (country, layer) => {
    layer.options.fillColor = country.properties.color;
    layer.on("click", function (e) {
      onCountrySelect(
        e.target.feature.id,
        e.target.feature.properties.summedAvgCasesPerMillion
      );
    });
  };

  return (
    <MapContainer style={{ height: "100%" }} zoom={3.5} center={[50, 35]}>
      <GeoJSON
        style={mapStyle}
        data={countries}
        onEachFeature={onEachCountry}
      />
    </MapContainer>
  );
};

export default WorldMap;
