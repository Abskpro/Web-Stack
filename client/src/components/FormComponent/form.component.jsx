import React, { Fragment, Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import mapboxgl from "mapbox-gl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { Form, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Container, Row, Col } from "react-bootstrap";
import { routeAndDisplay } from "../../actions/postAction.js";

//CSS
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
//this css has should have higher precedance so please always put in the last part
import "./formComponent.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJzazEyMzQiLCJhIjoiY2s3Z3Z3azB6MDQyNzNmbzkxd3MwN3hnNyJ9.-paJt9fSR1rw0Wq0LwSmig";

class Addroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      name: "",
      email: "",
      number: 0,
      type: "Room",
      location: "",
      description: "",
      area: 0,
      coordinates: [0, 0],
      bedroom: 0,
      kitchen: 0,
      toilet: 0,
      livingRoom: 0,
      price: 0,
      furnished: "Furnished",
      imageCollection: null,
      previewSource: [],
      lng: 85.314038,
      lat: 27.70549,
      zoom: 5,
      facilities: [],
      isProcessing: false,
      error: "",
    };

    this.onFileChange = this.onFileChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPreviewFile = this.onPreviewFile.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.setState({ email: this.props.auth.user.email });
    this.setState({ name: this.props.auth.user.name });
    this.setState({ number: this.props.auth.user.number });

    console.log(this.props.auth.user);
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });

    var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geolocate);
    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
    map.on("load", function () {
      map.resize();
    });

    map.addControl(new mapboxgl.NavigationControl());
    var marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([84.124, 28.3949])
      .addTo(map);

    const onDragEnd = () => {
      var lngLat = marker.getLngLat();
      console.log(lngLat.lng, lngLat.lat);
      this.setState({ coordinates: [lngLat.lng, lngLat.lat] });
    };
    marker.on("dragend", onDragEnd);

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      countries: "np",
    });

    geocoder.addTo("#location");
    geocoder.on("result", (result) => {
      console.log(result.result.text);
      this.setState({ location: result.result.text });
    });
  }

  onChangeLocation(e) {
    console.log(e.target.value);
    this.setState({ location: e.target.value });
  }

  onPreviewFile(file) {
    for (let i = 0; i < file.length; i++) {
      ((file) => {
        const reader = new FileReader();
        const blob = new Blob([file], { type: "image/png" });
        reader.readAsDataURL(blob);
        console.log(blob);
        reader.onload = () => {
          let data = [...this.state.previewSource];
          data.push(reader.result);
          this.setState({ previewSource: data });
        };
      })(file[i]);
    }
  }

  onChangeInput(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.id]: e.target.checked });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
    console.log(e.target.value);
  }

  fieldChecker() {
    return (
      this.state.name.length != 0 &&
      this.state.email.length != 0 &&
      this.state.number.length != 0 &&
      this.state.title.length != 0 &&
      this.state.location.length != 0 &&
      this.state.description.length != 0 &&
      this.state.coordinates[0].length != 0 &&
      this.state.bedroom != 0 &&
      this.state.toilet != 0 &&
      this.state.kitchen != 0 &&
      this.state.furnished.length != 0 &&
      this.state.facilities.length != 0
    );
  }

  onFileChange(e) {
    let file = [];
    file = [...e.target.files];
    console.log(e.target.files[0]);
    this.setState({ imageCollection: file });
    this.onPreviewFile(file);
  }

  //this is changed
  onSelect(value) {
    this.setState({ facilities: value });
    console.log(this.state.facilities);
  }

  async onSubmit(e) {
    e.preventDefault();

    if (this.fieldChecker()) {
      this.setState({ isProcessing: true });
      const data = {
        name: this.state.name,
        email: this.state.email,
        number: parseInt(this.state.number),
        title: this.state.title,
        location: this.state.location,
        area: parseInt(this.state.area),
        description: this.state.description,
        coordinates: {
          longitude: this.state.coordinates[0],
          latitude: this.state.coordinates[1],
        },
        rooms: {
          bedroom: parseInt(this.state.bedroom),
          kitchen: parseInt(this.state.kitchen),
          toilet: parseInt(this.state.toilet),
          livingRoom: parseInt(this.state.livingRoom),
        },
        furnished: this.state.furnished,
        facilities: this.state.facilities,
        price: parseInt(this.state.price),
        imageCollection: JSON.stringify(this.state.previewSource),
      };
      console.log(data);
      console.log(typeof JSON.stringify(data));

      var url;
      if (this.state.type == "Room") {
        url = "/api/ad/addRoom";
      } else {
        url = "/api/ad/addHouse";
      }

      axios
        .post(`${url}/${this.props.auth.user.id}`, data)
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
    
            routeAndDisplay(res.data.msg);
            this.props.history.push({
              pathname: "/profile",
            });
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      toast.info("Please enter all the fields" , {
					position: 'bottom-right',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					draggable:false,
					progress: undefined,
				})

    }
  }

  render() {
    const options = ["CableTv", "Parking", "Internet", "Water-Supply", "Air-Conditioning", "Bathtub"];
    return (
      <section className="user-section" style={{}}>
        <Container>
          <div className="user-section-holder">
            <form onSubmit={this.onSubmit} encType="multipart/form-data">
              <Row>
                <Col>
                  <label htmlFor="name">Name</label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={this.onChangeInput}
                    value={this.state.name}
                  />
                </Col>
                <Col>
                  <label htmlFor="title">Title</label>

                  <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={this.onChangeInput}
                    value={this.state.title}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label htmlFor="email">email</label>

                  <input
                    type="text"
                    name="email"
                    id="email"
                    onChange={this.onChangeInput}
                    value={this.state.email}
                  />
                </Col>

                <Col>
                  <label htmlFor="number">number</label>

                  <input
                    type="number"
                    name="number"
                    id="number"
                    onChange={this.onChangeInput}
                    value={this.state.number}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label htmlFor="location">location of room</label>

                  <div id="location" value={this.state.location} />
                </Col>
                <Col>
                  <label htmlFor="Type">Type</label>
                  <select
                    id="type"
                    value={this.state.type}
                    id="type"
                    onChange={this.onChangeInput}
                  >
                    <option value="House">House</option>
                    <option value="Room">Room</option>
                  </select>
                </Col>

                {this.state.type == "House" && (
                  <Col>
                    <label htmlFor="area">Area Sqft</label>
                    <input
                      type="number"
                      name="area"
                      id="area"
                      onChange={this.onChangeInput}
                      value={this.state.area}
                    />
                  </Col>
                )}
              </Row>

              <Row>
                <Col>
                  <label htmlFor="bedroom">Number of bedroom</label>

                  <input
                    type="number"
                    name="bedroom"
                    id="bedroom"
                    onChange={this.onChangeInput}
                    value={this.state.bedroom}
                  />
                </Col>

                <Col>
                  <label htmlFor="title">Number of kitchen</label>

                  <input
                    type="number"
                    name="kitchen"
                    id="kitchen"
                    onChange={this.onChangeInput}
                    value={this.state.kitchen}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label htmlFor="title">Number of toilet</label>

                  <input
                    type="number"
                    name="toilet"
                    id="toilet"
                    onChange={this.onChangeInput}
                    value={this.state.toilet}
                  />
                </Col>

                <Col>
                  <label htmlFor="title">Number of livingRoom</label>

                  <input
                    type="number"
                    name="livingRoom"
                    id="livingRoom"
                    min="0"
                    max="2"
                    onChange={this.onChangeInput}
                    value={this.state.livingRoom}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor="furnished">Furnished</label>

                  <select
                    id="furnished"
                    name="furnish"
                    onChange={this.onChangeInput}
                    value={this.state.furnished}
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Not furnished">Not Furnished</option>
                    <option value="Semi furnished">Semi Furnished</option>
                  </select>
                </Col>

                <Col>
                  <label htmlFor="facilities">Facilities</label>

                  <Multiselect
                    options={options}
                    isObject={false}
                    onSelect={this.onSelect}
                    onRemove={this.onSelect}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label htmlFor="title">price </label>

                  <input
                    type="number"
                    name="price"
                    id="price"
                    onChange={this.onChangeInput}
                    value={this.state.price}
                  />
                </Col>

                <Col>
                  <label htmlFor="images">Upload multiple images</label>

                  <input
                    type="file"
                    id="fileInput"
                    name="image"
                    onChange={this.onFileChange}
                    multiple
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor="description">description</label>

                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    onChange={this.onChangeInput}
                    value={this.state.description}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 htmlFor="map">Drag the marker to the location</h4>
                  <div className="map-content">
                    <div
                      ref={(el) => (this.mapContainer = el)}
                      className="mapContainer"
                    />
                  </div>
                </Col>
              </Row>
              {/* //description row */}

              <Row>
                <Col>
                  <div className="btn-content">
                    <Button variant="primary" type="submit">
                      {this.state.isProcessing === true && (
                        <Spinner animation="border" className="spinner" />
                      )}
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </form>
            {this.state.previewSource[0] &&
              this.state.previewSource.map((data, index) => (
                <img
                  src={data}
                  key={index}
                  alt="choosen"
                  style={{ height: "0" }}
                />
              ))}
          </div>
        </Container>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </section>
    );
  }
}

// export default Addroom;
Addroom.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { routeAndDisplay })(Addroom);

// <input type='submit' value='Submit' />
