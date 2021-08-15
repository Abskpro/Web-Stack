import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./Modal.css";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Model = (props) => {
  return (
    <Modal
      className="modal"
      {...props}
      size="lg"
      centered
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.comment.post.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <div className="modal-content">
          <div className="modal-content-row">
            <div className="modal-content-col">
              {props.comment.post.image != undefined ? (
                <img
                  src={`https://res.cloudinary.com/ds6o6pq2w/image/upload/v1607069456/images/${props.comment.post.image}.jpg`}
                  alt="#"
                />
              ) : (
                <img
                  src={`https://res.cloudinary.com/ds6o6pq2w/image/upload/v1607069456/images/no-image-placeholder.jpg`}
                  alt="#"
                />
              )}
            </div>
            <div className="modal-content-col">
              <div className="usr-info">
                <label className="usr-info-title">User :</label>
                <label className="usr-info-name">
                  &nbsp;
                  {props.comment.comment.name}
                </label>
              </div>

              <div className="usr-cmt">
                <div>{props.comment.comment.question}</div>
                <div className="usr-cmt-date">
                  <span>Posted in</span>
                  &nbsp;
                  <span>
                    {`${props.comment.comment.createdAt}`.slice(0, 10)}
                  </span>
                </div>
              </div>

              <form>
                <div>
                  <textarea
                    onChange={(e) => props.onChange(e)}
                    className="cmt-txt"

                    // placeholder={props.comment.comment.isAnswered ? props.comment.comment.answer : "Enter your response" }
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={(e) => props.save(e)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Model;
