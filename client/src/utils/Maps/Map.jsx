import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

import './Map.css';


mapboxgl.accessToken = "pk.eyJ1IjoiYWJzazEyMzQiLCJhIjoiY2s3Z3Z3azB6MDQyNzNmbzkxd3MwN3hnNyJ9.-paJt9fSR1rw0Wq0LwSmig";

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: props.lat,
            lat: props.lng,
            zoom: 13,
        };
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        console.log(this.state.lng,this.state.lat)
        
        var marker = new mapboxgl.Marker()
            .setLngLat([this.state.lng, this.state.lat])
            .addTo(map);

    }

    render() {
        return (
            <div>
                <div
                    ref={(el) => (this.mapContainer = el)}
                    className="mapContainer"
                    id="map"
                />
            </div>
        );
    }
}

export default Map
