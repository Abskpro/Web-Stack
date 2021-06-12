import React, { Fragment, Component } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Container, Row, Col } from "react-bootstrap";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { ToastContainer, toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { routeAndDisplay } from "../../../actions/postAction.js";
//CSS
import "../../FormComponent/formComponent.css";
import "./EditPost.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJzazEyMzQiLCJhIjoiY2s3Z3Z3azB6MDQyNzNmbzkxd3MwN3hnNyJ9.-paJt9fSR1rw0Wq0LwSmig";

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      title: "",
      name: "",
      email: "",
      number: 0,
      location: "",
      description: "",
      coordinates: [0, 0],
      bedroom: 0,
      kitchen: 0,
      toilet: 0,
      livingRoom: 0,
      price: 0,
      area: 0,
      furnished: "Furnished",
      imageCollection: null,
      previewSource: [],
      lng: 85.314038,
      lat: 27.70549,
      zoom: 5,
      facilities: [],
    };

    this.onFileChange = this.onFileChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPreviewFile = this.onPreviewFile.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    const data = this.props.location.state;
    let coor = [data.coordinates.longitude, data.coordinates.latitude];
    console.log(data);
    console.log(data.coordinates.longitude);
    this.setState({ id: this.props.location.state._id });
    this.setState({ title: data.title });
    this.setState({ name: data.name });
    this.setState({ description: data.description });
    this.setState({ email: data.email });
    this.setState({ number: data.number });
    this.setState({ location: data.location });
    this.setState({ price: data.price });
    this.setState({ facilities: data.facilities });
    this.setState({ furnished: data.furnished });
    this.setState({ bedroom: data.rooms.bedroom });
    this.setState({ kitchen: data.rooms.kitchen });
    this.setState({ livingRoom: data.rooms.livingRoom });
    this.setState({ toilet: data.rooms.toilet });
    this.setState({ coordinates: coor });
    this.setState({ imageCollection: data.imageCollection });
    if (this.props.location.state.area) {
      this.setState({ area: data.area });
    }

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });
    setTimeout(() => {
      console.log(this.state.imageCollection);
    }, 5000);
    map.addControl(new mapboxgl.NavigationControl());
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
    console.log(this.state.id);
    var marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([
        this.props.location.state.coordinates.longitude,
        this.props.location.state.coordinates.latitude,
      ])
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
      placeholder: data.location,
    });

    geocoder.addTo("#location");
    geocoder.on("result", (result) => {
      this.setState({ location: result.result.text });
    });
    console.log(this.state.coordinates[0], this.state.coordinates[1]);
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

  onFileChange(e) {
    let file = [];
    file = [...e.target.files];
    console.log(e.target.files[0]);
    // this.setState({ imageCollection: file });
    this.onPreviewFile(file);
  }

  //this is changed
  onSelect(value) {
    this.setState({ facilities: value });
    console.log(this.state.facilities);
  }

  async onSubmit(e) {
    e.preventDefault();
    const data = {
      name: this.state.name,
      email: this.state.email,
      number: parseInt(this.state.number),
      title: this.state.title,
      location: this.state.location,
      description: this.state.description,
      coordinates: {
        latitude: this.state.coordinates[0],
        longitude: this.state.coordinates[1],
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
      imageCollection: this.state.imageCollection,
      additionalImage: JSON.stringify(this.state.previewSource),
    };

    const House = {
      name: this.state.name,
      email: this.state.email,
      number: parseInt(this.state.number),
      title: this.state.title,
      location: this.state.location,
      description: this.state.description,
      coordinates: {
        latitude: this.state.coordinates[0],
        longitude: this.state.coordinates[1],
      },
      area: this.state.area,
      rooms: {
        bedroom: parseInt(this.state.bedroom),
        kitchen: parseInt(this.state.kitchen),
        toilet: parseInt(this.state.toilet),
        livingRoom: parseInt(this.state.livingRoom),
      },
      furnished: this.state.furnished,
      facilities: this.state.facilities,
      price: parseInt(this.state.price),
      imageCollection: this.state.imageCollection,
      additionalImage: JSON.stringify(this.state.previewSource),
    };
    console.log(data);
    console.log(typeof JSON.stringify(data));
    if (this.props.location.state.area) {
      axios
        .put(
          `/api/profile/updateHomePost/${this.props.location.state._id}`,
          House
        )
        .then((res) => {
          this.props.routeAndDisplay(res);

          if (res.status == 200) {
            this.props.history.goBack();
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      axios
        .put(`/api/profile/updatePost/${this.props.location.state._id}`, data)
        .then((res) => {
          console.log(res);
          this.props.routeAndDisplay(res);

          if (res.status == 200) {
            this.props.history.goBack();
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }

  onDelete(e) {
    axios
      .post(`/api/profile/deletepost/${this.props.location.state._id}`, {
        type: this.state.area == 0 ? "Room" : "House",
      })
      .then((res) => {
        this.props.routeAndDisplay(res);
      })
      .catch((error) => console.log(error.response));
  }

  render() {
    const options = ["CableTv", "Parking", "Internet", "Water-Supply"];
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
                    selectedValues={this.state.facilities}
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
                  <label htmlFor="location">location of room</label>

                  <div id="location" value={this.state.location} />
                </Col>

                {this.props.location.state.area && (
                  <Col>
                    <label htmlFor="description">Area (in sqft)</label>
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
              <Row noGutters={true}>
                {this.state.imageCollection &&
                  this.state.imageCollection.map((image) => {
                    return (
                      <Col>
                        <div className="post-image">
                          <div className="image-container">
                            <img
                              src={`https://res.cloudinary.com/ds6o6pq2w/image/upload/v1607069456/images/${image}.jpg`}
                              alt="#"
                            />
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                {this.state.previewSource[0] &&
                  this.state.previewSource.map((data, index) => (
                    <img
                      src={data}
                      key={index}
                      alt="choosen"
                      style={{
                        height: "300px",
                      }}
                    />
                  ))}
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
                  <h3 htmlFor="map">Drag the marker to the location</h3>
                  <div className="map-content">
                    <div
                      ref={(el) => (this.mapContainer = el)}
                      className="mapContainer"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="btn-content">
                    <input type="submit" value="UPDATE" />

                    <button
                      className="btn-delete btn-danger"
                      onClick={this.onDelete}
                    >
                      DELETE
                    </button>
                  </div>
                </Col>
              </Row>
            </form>
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

EditPost.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { routeAndDisplay })(
  withRouter(EditPost)
);
