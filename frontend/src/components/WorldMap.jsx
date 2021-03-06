import React from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css";

export default class WorldMap extends React.Component {
  constructor(props) {
    super(props);

    // Component-level state
    this.state = {
      currentLayer: null,
    };

    // Component-level constants
    this.styles = {
      default: {
        weight: 0.5,
        color: "black",
        fillOpacity: 1,
      },
      highlight: {
        weight: 3.5,
        color: "black",
        fillOpacity: 0.7,
      },
    };
  }

  processLayerClick = (layer) => {
    // If any layer is currently selected then unselect it
    if (this.state.currentLayer) {
      console.log(`Resetting borders of ${this.state.currentLayer.feature.id}`);
      this.state.currentLayer.setStyle(this.styles.default);
    }
    if (layer === this.state.currentLayer) {
      // If we're clicking on the previously-selected layer then set current layer to none
      this.setState({ currentLayer: null });
    } else {
      // Otherwise highlight the selected layer and set the current layer to point at it
      console.log(`Highlighting borders of ${layer.feature.id}`);
      layer.setStyle(this.styles.highlight);
      this.setState({ currentLayer: layer });
    }
  };

  onEachCountry = (country, layer) => {
    layer.options.fillColor = country.properties.color;
    layer.on(
      "click",
      function (event) {
        // Process the click on the current layer
        this.processLayerClick(layer);
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
}
