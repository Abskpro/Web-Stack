import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../PostDetails.css";
// import Map from "../../../../utils/Maps/Map.jsx";
import Map from "../Map.jsx";

const Image = (props) => (
  <div>
    <img src={props.img} alt="#" />
  </div>
);

const Comment = (props) => (
  <div className="comment">
    <div className="user-name">by {props.comment.name}</div>
    <div className="comment-flex-container">
      <div className="user-comment">{props.comment.question}</div>
      <br></br>
      <div className="user-reply">{props.comment.answer}</div>
    </div>
  </div>
);

class RoutedPostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      coordinates: { longitude: 2, latitude: 2 },
      longitude: 0,
      latitude: 0,
      description: "",
      furnished: "Furnished",
      email: "",
      facilities: [],
      imageCollection: [],
      location: "",
      name: "",
      number: "",
      price: "",
      rooms: { bedroom: 0, kitchen: 1, livingRoom: 0, toilet: 1 },
      title: "",
      isLogged: true,
      question: "",
      btnColor: "btn-disable",
      comments: [],
      postId: "",
      area: "",
    };

    this.displayImage = this.displayImage.bind(this);
    this.loadComment = this.loadComment.bind(this);
    this.comment = this.comment.bind(this);
  }

  componentDidMount() {
    console.log(typeof this.props.match.params.type);
    axios
      .get(
        `/api/search/post/${this.props.match.params.id}/${this.props.match.params.type}`
      )
      .then((data) => {
        console.log(data.data);
        this.setState({ post: data.data });
        // this.setState({ coordinates: data.data.coordinates });
        this.setState({ longitude: data.data.coordinates.longitude });
        this.setState({ latitude: data.data.coordinates.latitude });
        this.setState({ description: data.data.description });
        this.setState({ furnished: data.data.furnished });
        this.setState({ email: data.data.email });
        this.setState({ facilities: data.data.facilities });
        this.setState({ imageCollection: data.data.imageCollection });
        this.setState({ location: data.data.location });
        this.setState({ name: data.data.name });
        this.setState({ number: data.data.number });
        this.setState({ price: data.data.price });
        this.setState({ rooms: data.data.rooms });
        this.setState({ titile: data.data.title });
        this.setState({ postId: data.data._id });
        if (data.data.area) {
          this.setState({ area: data.data.area });
        }
        console.log(this.state.post);

        localStorage.jwtToken != null
          ? this.setState({ isLogged: true })
          : this.setState({ isLogged: false });
        axios
          .get(`/api/comment/loadComment/${this.state.postId}`)
          .then((data) => {
            console.log(data.data);
            this.setState({ comments: data.data });
          });
      });
    setTimeout(() => {
      console.log(this.state.coordinates, this.state.longitude);
    }, 2000);
  }

  loadComment() {
    return this.state.comments.map((currentComment, index) => {
      return <Comment comment={currentComment} key={currentComment._id} />;
    });
  }

  comment() {
    if (this.state.question != "") {
      this.setState({ btnColor: "btn-disable" });
      let id = {
        postId: this.state.postId,
        userId: this.props.auth.user.id,
      };
      let data = {
        name: this.props.auth.user.name,
        question: this.state.question,
      };
      axios
        .post(`/api/comment/addComment/${JSON.stringify(id)}`, data)
        .then((data) => {
          this.setState({ question: "" });
          if (data.status == 200) {
            toast.info(`${data.data.msg}`, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          if (data.status == 400) {
            toast.info("Unable to add comment", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }

          console.log(data);
          axios
            .get(`/api/comment/loadComment/${this.state.postId}`)
            .then((data) => {
              console.log(data);
              this.setState({ comments: data.data });
            });
        });
    } else {
      console.log("comment must not be empty");
    }
  }

  displayImage() {
    return this.state.imageCollection.map((image, index) => {
      let url = `https://res.cloudinary.com/ds6o6pq2w/image/upload/v1605056350/images/${image}`;
      return <Image img={url} key={this.state._id} />;
    });
  }

  render() {
    return (
      <div className="post-detail-container">
        <Container>
          <h2>Room Description</h2>
          <Row>
            <Col>
              <div className="post-detail-content image-container">
                <Carousel autoPlay>{this.displayImage()}</Carousel>
              </div>
            </Col>

            <Col>
              <div className=" post-detail-content post-details-info">
                <div className="post-title">
                  <h5>{this.state.title}</h5>
                </div>

                <div className="basic-info">
                  <div>Name: {this.state.name}</div>
                  <div>
                    Email:{" "}
                    <a href="#" id="mail">
                      {this.state.email}
                    </a>
                  </div>
                  <div>
                    Number: <a href={this.state.number}>{this.state.number}</a>
                  </div>
                </div>

                <div className="post-description">
                  <h5>Description</h5>
                  <p>{this.state.description}</p>
                </div>

                <div className="post-room-state">
                  <h5>Benifits</h5>
                  <ul id="room-status">
                    <li>Room: {this.state.furnished}</li>

                    <li>Bedroom: {this.state.rooms.bedroom}</li>
                    <li>Kitchen: {this.state.rooms.kitchen}</li>
                    <li>livingRoom: {this.state.rooms.livingRoom}</li>

                    <li>toilet: {this.state.rooms.toilet}</li>
                  </ul>
                </div>

                <div className="post-room-facilities">
                  <h5>Facilities:</h5>
                  <ul>
                    {this.state.facilities.map((facility, index) => (
                      <li>{facility}</li>
                    ))}
                  </ul>
                </div>

                {this.state.area && (
                  <div className="post-room-facilities">
                    <h5>Area:</h5>
                    <p>{this.state.area} sqft</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <div className="post-detail-outer-content">
            <div className="post-room-location-container">
              <h5>Location</h5>
              {this.state.longitude > 0 && (
                <div className="post-room-location">
                  <div>Map</div>
                  <Map lng={this.state.longitude} lat={this.state.latitude} />
                </div>
              )}
            </div>

            <div className="post-room-comment">
              <h5>Comment</h5>
              {this.state.isLogged ? (
                <div className="cmnt-container">
                  <textarea
                    name="cmnt"
                    id="comment"
                    cols="70"
                    rows="3"
                    placeholder="Add Comment"
                    value={this.question}
                    onChange={(e) => {
                      this.setState({ question: e.target.value });
                    }}
                  ></textarea>

                  <button
                    disabled={this.state.question.length < 1}
                    className={this.btnColor}
                    id="comment-btn"
                    onClick={this.comment}
                  >
                    Add Comment
                  </button>

                  <div className="post-comments">
                    <div className="comment-container">
                      {this.loadComment()}
                    </div>
                  </div>
                </div>
              ) : (
                <span>Log in to add comment</span>
              )}
            </div>

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
          </div>
        </Container>
      </div>
    );
  }
}

RoutedPostDetail.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps)(withRouter(RoutedPostDetail));
