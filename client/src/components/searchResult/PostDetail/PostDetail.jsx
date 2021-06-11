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

import "./PostDetails.css";
import Map from "./Map.jsx";
// import Map from '../../../utils/Maps/Map.jsx';

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
      <br />
      <div className="user-reply">{props.comment.answer}</div>
    </div>
  </div>
);

const PostDetail = (props) => {
  const [isLogged, setIsLogged] = useState(true);
  const [question, setQuestion] = useState("");
  const [btnColor, setBtnColor] = useState("btn-disable");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComment, setLoadingComments] = useState(true);
  const [post, setPost] = useState(null);

  function displayImage() {
    console.log(props.location.state);
    return post.imageCollection.map((image, index) => {
      let url = `https://res.cloudinary.com/ds6o6pq2w/image/upload/v1605056350/images/${image}`;
      return <Image img={url} key={post._id} />;
    });
  }

  useEffect(() => {
      console.log(props.location.state);
    if (props.location.state != undefined) {
      setPost(props.location.state);
      setLoading(false);
    } else {
      console.log("secondj aiasdf runnig");
      axios
        .get(
          `/api/search/post/${props.match.params.id}/${props.match.params.type}`
        )
        .then((data) => {
          console.log(data);
          setPost(data.data);
          setLoading(false);
        });
    }
    localStorage.jwtToken != null ? setIsLogged(true) : setIsLogged(false);
  }, []);

  function loadComment() {
    console.log("loading is " + loading + "and post is  " + post); 
    if (loadingComment && post != null) {
      axios.get(`/api/comment/loadComment/${post._id}`).then((data) => {
        console.log(data.data);
        setComments(data.data);
        setLoadingComments(false);
      });
    }
    return comments.map((currentComment, index) => {
      return <Comment comment={currentComment} key={currentComment._id} />;
    });
  }

  function comment() {
    if (question != "") {
      setBtnColor("btn-enable");
      console.log(props.auth);
      let id = {
        postId: post._id,
        userId: props.auth.user.id,
      };
      let data = {
        name: props.auth.user.name,
        question: question,
      };
      console.log(id);
      axios
        .post(`/api/comment/addComment/${JSON.stringify(id)}`, data)
        .then((data) => {
          setQuestion("");
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
            .get(`/api/comment/loadComment/${post._id}`)
            .then((data) => {
              console.log(data);
              setComments(data.data);
            });
        });
    } else {
      console.log("comment must not be empty");
    }
  }

  return (
    <div>
      {loading || !post ? (
        <h1>loading ...</h1>
      ) : (
        <div className="post-detail-container">
          <Container>
            <h2>Room Description</h2>
            <Row>
              <Col>
                <div className="post-detail-content image-container">
                  <Carousel autoPlay>{displayImage()}</Carousel>
                </div>
              </Col>

              <Col>
                <div className=" post-detail-content post-details-info">
                  <div className="post-title">
                    <h5>{post.title}</h5>
                  </div>

                  <div className="basic-info">
                    <div>Name: {post.name}</div>
                    <div>
                      Email:{" "}
                      <a href="#" id="mail">
                        {post.email}
                      </a>
                    </div>
                    <div>
                      Number: <a href={post.number}>{post.number}</a>
                    </div>
                  </div>

                  <div className="post-description">
                    <h5>Description</h5>
                    <p>{post.description}</p>
                  </div>

                  <div className="post-room-state">
                    <h5>Benifits</h5>
                    <ul id="room-status">
                      <li>Room: {post.furnished}</li>

                      <li>Bedroom: {post.rooms.bedroom}</li>
                      <li>Kitchen: {post.rooms.kitchen}</li>
                      <li>livingRoom: {post.rooms.livingRoom}</li>

                      <li>toilet: {post.rooms.toilet}</li>
                    </ul>
                  </div>

                  <div className="post-room-facilities">
                    <h5>Facilities:</h5>
                    <ul>
                      {post.facilities.map((facility, index) => (
                        <li>{facility}</li>
                      ))}
                    </ul>
                  </div>

                  {post.area && (
                    <div className="post-room-facilities">
                      <h5>Area:</h5>
                      <p>{post.area} sqft</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <h5>Location</h5>
                <Map
                  lng={post.coordinates.longitude}
                  lat={post.coordinates.latitude}
                />
              </Col>
            </Row>

            <div className="post-room-comment">
              <h5>Comment</h5>
              {isLogged ? (
                <div className="cmnt-container">
                  <textarea
                    name="cmnt"
                    id="comment"
                    cols="70"
                    rows="3"
                    placeholder="Add Comment"
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                    }}
                  ></textarea>

                  <button
                    disabled={question.length < 1}
                    className={btnColor}
                    id="comment-btn"
                    onClick={comment}
                  >
                    Add Comment
                  </button>
                </div>
              ) : (
                <span>Log in to add comment</span>
              )}
              <div className="post-comments">
                <div className="comment-container">{loadComment()}</div>
              </div>
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
          </Container>
        </div>
      )}
    </div>
  );
};

PostDetail.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps)(withRouter(PostDetail));
