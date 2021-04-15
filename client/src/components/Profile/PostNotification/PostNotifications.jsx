import React, { Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import mapboxgl from "mapbox-gl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Container, Row, Col } from "react-bootstrap";
import "./PostNotification.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJzazEyMzQiLCJhIjoiY2s3Z3Z3azB6MDQyNzNmbzkxd3MwN3hnNyJ9.-paJt9fSR1rw0Wq0LwSmig";

class PostNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "Room",
      location: "",
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
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

  async submit(e) {
    e.preventDefault();
    const data = {
      type: this.state.type,
      location: this.state.location,
      email: this.props.auth.user.email,
    };
    console.log(this.props);
    axios
      .post(`/api/notify/add/notification/${this.props.auth.user.id}`, data)
      .then((res) => {
        console.log("added");
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  render() {
    return (
      <Fragment>
        <form onSubmit={this.submit}>
          <div className="type">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={this.state.type}
              id="type"
              onChange={this.onChangeInput}
            >
              <option value="House">House</option>
              <option value="Room">Room</option>
            </select>
          </div>

          <div className="location">
            <label htmlFor="location">Location</label>
            <div id="location" value={this.state.location} />
          </div>
          <div className="btn-content">
            <input type="submit" value="Notify" />
          </div>
        </form>
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
      </Fragment>
    );
  }
}

PostNotification.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps)(withRouter(PostNotification));
