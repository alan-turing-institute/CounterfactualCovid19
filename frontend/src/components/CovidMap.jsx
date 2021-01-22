import React from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./CovidMap.css";

const CovidMap = ({ countries, onCountrySelect }) => {
  const mapStyle = {
    fillColor: "white",
    weight: 1,
    color: "black",
    fillOpacity: 1,
  };

  const onEachCountry = (country, layer) => {
    layer.options.fillColor = country.properties.color;
    const name = country.properties.name;
    const confirmedText = country.properties.confirmedText;
    layer.bindPopup(`${name} ${confirmedText}`);
    layer.on("click", function (e) {
      onCountrySelect(e.target.feature.properties.iso_code);
    });
  };

  return (
    <MapContainer style={{ height: "100%" }} zoom={2} center={[20, 60]}>
      <GeoJSON
        style={mapStyle}
        data={countries}
        onEachFeature={onEachCountry}
      />
    </MapContainer>
  );
};

export default CovidMap;
