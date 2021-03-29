import React from 'react';
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css";

export default class WorldMap extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      currentLayer: null,
    };

    this.styles = {
      default: {
        // fillColor: "white",
        weight: 1,
        color: "black",
        fillOpacity: 1,
      },
      highlight: {
        weight: 5,
        color: "grey",
        fillOpacity: 0.7
      }
    };
  }

  onEachCountry = (country, layer) => {
    layer.options.fillColor = country.properties.color;
    layer.on("click", function (event) {
      console.log("layer options");
      console.log(layer.options);
      // Start by resetting the style on the current feature
      if (this.state.currentLayer) {
        this.state.currentLayer.setStyle(this.styles.default);
        // this.options.fillColor = country.properties.color;
      }
      // If the new layer is not the same as the previous layer then enable a dark outline on it
      if (layer !== this.state.currentLayer) {
        console.log(`Highlighting ${layer}`);
        layer.setStyle(this.styles.highlight);
      }
      // Keep track of the new selected layer
      this.setState({currentLayer: layer});
      // Pass the target ISO code and number of cases up to the callback function
      this.props.onCountrySelect(
        event.target.feature.id,
        event.target.feature.properties.summedAvgCasesPerMillion
      );
      }.bind(this) // allows the use of 'this' referring to the WorldMap object inside the anonymous function
    );
  };

  // This is evaluated whenever the component is rendered
  render() {
    return (
      <MapContainer style={{ height: "100%" }} zoom={3.5} center={[50, 35]}>
        <GeoJSON
          style={this.styles.default}
          data={this.props.countries}
          onEachFeature={this.onEachCountry}
        />
      </MapContainer>
    );
  }
};
