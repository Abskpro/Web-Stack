import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

import "./Map.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJzazEyMzQiLCJhIjoiY2s3Z3Z3azB6MDQyNzNmbzkxd3MwN3hnNyJ9.-paJt9fSR1rw0Wq0LwSmig";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: null,
      lat: null,
      zoom: 13,
    };
  }

  componentDidMount() {
    // const map = new mapboxgl.Map({
    //   container: this.mapContainer,
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [this.state.lng, this.state.lat],
    //   zoom: this.state.zoom,
    // });

    console.log(this.state.lng, this.state.lat);

    // if (this.state.lng === null && this.state.lat === null) {
    //   var marker = new mapboxgl.Marker()
    //     .setLngLat([this.state.lng, this.state.lat])
    //     .addTo(map);
    // }
  }

  componentWillReceiveProps(nextProps) {
    console.log("running ...");
    console.log(this.props);
    this.setState({ lng: this.props.lng });
    this.setState({ lat: this.props.lat });
  }

  render() {
    return (
      <div>
        {this.state.lng }
        {this.state.lat}
      </div>
    );
  }
}

export default Map;
// <div
//           ref={(el) => (this.mapContainer = el)}
//           className="mapContainer"
//           id="map"
//         >
//         </div>
