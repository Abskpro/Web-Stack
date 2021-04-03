import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import { displayStuff } from "../../actions/searchAction.js";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Multiselect } from "multiselect-react-dropdown"; /**/
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; /*mapbox css need overide*/
import axios from "axios";
import "../FormComponent/search.css"; /*search css hatune*/

import "./BannerSearch.css";
import { Container, Row, Col } from "react-bootstrap";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJzazEyMzQiLCJhIjoiY2s3Z3Z3azB6MDQyNzNmbzkxd3MwN3hnNyJ9.-paJt9fSR1rw0Wq0LwSmig";

const BannerSearch = (props) => {
  const [location, updatelocation] = useState("");
  const [price, updateprice] = useState(0);
  const [furnished, updateFurnished] = useState("");
  const [type, updatetype] = useState("");
  const [bedroom, updateBedroom] = useState(1);
  const [kitchen, updateKitchen] = useState(1);
  const [toilet, updateToilet] = useState(1);
  const [livingRoom, updateLivingRoom] = useState(0);
  const [facilities, updateFacilities] = useState([]);
  const options = ["CableTv", "Parking", "Internet", "Water-Supply"];

  const [latestHouse, updateLatestHouse] = useState([]);
  const [latestRoom, updateLatestRoom] = useState([]);

  /*mapbox css*/
  useEffect(() => {
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      countries: "np",
    });

    geocoder.addTo("#location");
    geocoder.on("result", (result) => {
      console.log(result.result.text);
      updatelocation(result.result.text);
    });
    axios.get("http://localhost:5000/api/search/latest-post").then((data) => {
      updateLatestRoom(data.data[1]);
      updateLatestHouse(data.data[0]);
      console.log(data.data);
    });
  }, []);

  function onChangePreference(e) {
    if (e.target.name === "bedroom") {
      updateBedroom(e.target.value);
    } else if (e.target.name === "kitchen") {
      updateKitchen(e.target.value);
    } else if (e.target.name === "toilet") {
      updateToilet(e.target.value);
    } else {
      updateLivingRoom(e.target.value);
    }
  }

  function onChangeHandler(e) {
    if (e.target.name === "furnished") {
      updateFurnished(e.target.value);
    }
  }

  function onSelect(value) {
    updateFacilities(value);
    console.log(facilities);
  }

  function submit(e) {
    e.preventDefault();
    console.log(data);
    console.log(
      location,
      price,
      furnished,
      type,
      facilities,
      bedroom,
      kitchen,
      toilet,
      livingRoom
    );
    const data = {
      location: location,
      type: type,
      preferences: {
        bedroom: parseInt(bedroom),
        toilet: parseInt(toilet),
        kitchen: parseInt(kitchen),
        livingRoom: parseInt(livingRoom),
      },
      facilities: facilities,
      furnished: furnished,
    };
    props.displayStuff(data);
    props.history.push("/result");
  }

  function loadRoom() {
    return latestRoom.map((currentRoom, index) => {
      return <Posts post={currentRoom} key={currentRoom._id} props={props} />;
    });
  }

  function loadHouse() {
    return latestHouse.map((currentHouse, index) => {
      return <Posts post={currentHouse} key={currentHouse._id} props={props} />;
    });
  }

  return (
    <main>
      <section className="banner">

        <Container>
          <div className="banner-container">
            <h1>
              Choose Your
              <br />
              Space
            </h1>
            <form onSubmit={submit}>
              <div className="search-box-container">
                <Row className = "justify-content-center">
                  <Col lg="2" sm="4" xs="6">
                    <div className="search-box">
                      <div className="search-description">Location</div>
                      <div id="location"></div>
                    </div>
                  </Col>
                  <Col lg="2" sm="4" xs="6">
                    <div className="search-box">
                      <div className="search-description">Property Type</div>
                      <select
                        id="type"
                        value={type}
                        onChange={(e) => updatetype(e.target.value)}
                      >
                        <option value="house">House</option>
                        <option value="room">Room</option>
                      </select>
                    </div>
                  </Col>
                  
                  <Col lg="2" sm="4" xs="6">
                    <div className="search-box dropdown">
                      <div className="search-description">Preference</div>
                      <button
                        className="dropbtn"
                        onClick={(e) => e.preventDefault()}
                      >
                        Preference
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-content-pref">
                          <label>Bedroom</label>
                          <input
                            type="number"
                            name="bedroom"
                            value={bedroom}
                            onChange={onChangePreference}
                            max="5"
                            min="1"
                          />
                        </div>
                        <div className="flex-content-pref">
                          <label>Livingroom</label>
                          <input
                            type="number"
                            name="livingroom"
                            value={livingRoom}
                            onChange={onChangePreference}
                            max="2"
                            min="0"
                          />
                        </div>
                        <div className="flex-content-pref">
                          <label>Kitchen</label>
                          <input
                            type="number"
                            value={kitchen}
                            name="kitchen"
                            onChange={onChangePreference}
                            max="2"
                            min="1"
                          />
                        </div>
                        <div className="flex-content-pref">
                          <label>Toilet</label>
                          <input
                            type="number"
                            value={toilet}
                            name="toilet"
                            onChange={onChangePreference}
                            max="2"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="2" sm="4" xs="6">
                    <div className="search-box facilities">
                      <div className="search-description">Facilities</div>
                      <Multiselect
                        options={options}
                        isObject={false}
                        onSelect={onSelect}
                        onRemove={onSelect}
                      />
                    </div>
                  </Col>
                  <Col lg="2" sm="4" xs="6">
                    <div className="search-box">
                      <div className="search-description">Furnished ?</div>

                      <select
                        value={furnished}
                        onChange={(e) => updateFurnished(e.target.value)}
                      >
                        <option value="FullyFurnished">FullyFurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Not-Furnished">Not-Furnished</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
              <input type="submit" value="Search" className="submit-button" />
            </form>
          </div>
        </Container>
      </section>
      
      <section className = "recent">
        <Container>
          <h3>Room Listing</h3>
          <Row> 
            {loadRoom()}
          </Row>
          <h3>House Listing</h3>
          <Row>
            {loadHouse()}
          </Row>
        </Container>
      </section>
    </main>
  );
};

const navigate = (props) => {
  console.log(props);
  props.props.history.push({
    pathname: "/details/",
    state: props.post,
  });
};

const Posts = (props) => (
  <Col onClick={() => navigate(props)} >

    <div className = "post-card">
      <div className="post-card-img-container">
        <img
          src={`https://res.cloudinary.com/ds6o6pq2w/image/upload/v1607069456/images/${props.post.imageCollection[0]}.jpg`}
          alt="#"
        />
      </div>

      <div className="recent-content-item recent-content-title">{props.post.title}</div>
      <div className = "recent-content-item recent-content-location">{props.post.location}</div>
      <div className = "recent-content-item recent-content-price">{props.post.price}</div>
    </div>
  </Col>
);

// export default BannerSearch;

const mapStateToProps = (state) => ({
  auth: state.auth,
  data: state.data,
  errors: state.errors,
});

BannerSearch.protoTypes = {
  displayStuff: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { displayStuff })(BannerSearch);
