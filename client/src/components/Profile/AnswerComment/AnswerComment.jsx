import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Switch from "react-switch";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Model from "./Modal/Modal.jsx";
import "./AnswerComment.css";

async function fetchUserComments(props) {
  return axios
    .get(`/api/profile/loadComment/${props.auth.user.id}`)
    .then((data) => data);
}

async function fetchUserReply(props) {
  return axios
    .get(`/api/profile/loadReply/${props.auth.user.id}`)
    .then((data) => {
      return data;
    });
}

const AnswerComment = (props) => {
  const [comment, setComment] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedComment, setSelectedComment] = useState({});
  const [clicked, setClicked] = useState(false);
  const [response, setResponse] = useState("");
  const [reload, reloadPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState([]);
  const [isComment, setIsComment] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let list = await fetchUserComments(props);
      let replylist = await fetchUserReply(props);
      setComment(
        list.data.filter((comment) => {
          return comment.comment.length > 0;
        })
      );
      setReply(
        replylist.data.map((comment) => {
          return comment;
        })
      );
      setLoading(false);
      console.log(list);
    }
    fetchData();
  }, [props, reload]);

  function responseSetter(e) {
    if (e.target.value) {
      e.preventDefault();
      setResponse(e.target.value);
    }
  }

  function saveReply(e) {
    let reply = {
      answer: response,
    };
    axios
      .put(`/api/comment/ansComment/${selectedComment.comment._id}`, reply)
      .then((res) => {
        setModalShow(false);
        reloadPage(!reload);
      })
      .catch((err) => console.log(err));
  }

  const Post = (props) => {
    console.log(props);
    let url = `${window.location.origin}/routed/detail/${props.comment.postId}/${props.post.type}`;
    return (
      <div
        className={
          props.comment.isAnswered
            ? "ans-cmt-contents-white"
            : "ans-cmt-contents-grey"
        }
      >
        <Row>
          <Col xs="6" md="2">
            <div className="ans-cmt-content">
              <div className="search-page-image">
                {props.post.image != undefined ? (
                  <a href={url}>
                    <img
                      src={`https://res.cloudinary.com/ds6o6pq2w/image/upload/v1607069456/images/${props.post.image}.jpg`}
                      alt="#"
                    />
                  </a>
                ) : (
                  <a href={url}>
                    <img
                      src={`https://res.cloudinary.com/ds6o6pq2w/image/upload/v1607069456/images/no-image-placeholder.jpg`}
                      alt="#"
                    />
                  </a>
                )}
              </div>
            </div>
          </Col>

          <Col xs="6" md="10">
            <div className="ans-cmt-content">
              <div className="search-page-descriptions">
                <h4 className="search-page-title">{props.post.title}</h4>
              </div>
              <div className="comment-container flex-text">
                <div>Q: &nbsp;</div>
                <div className="cmnt">{props.comment.question}</div>
              </div>
              {props.comment.isAnswered && (
                <div className="answer-container flex-text">
                  <div>A: &nbsp;</div>
                  <div className="reply">{props.comment.answer}</div>
                </div>
              )}
              {isComment && (
                <div>
                  <button
                    className="reply-btn"
                    onClick={() => {
                      console.log("clicked");
                      setSelectedComment(props);
                      setModalShow(true);
                      setClicked(true);
                    }}
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  function displayQueries() {
    console.log(reply);
    if (isComment) {
      return comment.map((post, index) => {
        return post.comment.map((comment, index) => {
          return <Post post={post} key={index} comment={comment} />;
        });
      });
    }
    return reply.map((post, index) => {
      return <Post post={post} key={index} comment={post.comment} />;
    });
  }

  function displayModal() {
    console.log(selectedComment);
    return (
      <Model
        show={modalShow}
        onHide={() => setModalShow(false)}
        onChange={responseSetter}
        comment={selectedComment}
        save={saveReply}
        centered
      />
    );
  }

  function handleChange(checked) {
    setIsComment(checked);
  }

  return loading == true ? (
    <h2>Loading ...</h2>
  ) : comment.length === 0 && reply.length === 0 ? (
    <h2>No comments found</h2>
  ) : (
    <div className="post-comment-container">
      <label>
        <div>{isComment ? "Comments" : "Replies"} </div>
        <Switch
          onChange={handleChange}
          checked={isComment}
          offColor={"#0000FF"}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </label>
      {displayQueries()}
      {clicked ? displayModal() : null}
    </div>
  );
};

AnswerComment.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps)(withRouter(AnswerComment));
