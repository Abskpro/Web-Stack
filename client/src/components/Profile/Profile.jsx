import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import UserPosts from "./UserPosts/UserPosts.jsx";
import UserInfo from "./UserInfo/UserInfo.jsx";
import AnswerComment from "./AnswerComment/AnswerComment.jsx";
import "./Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Profile = (props) => {
  const [key, setKey] = useState("home");

  useEffect(() => {
    console.log("thesea are the ", props);
    if (props.msg.message.status != null) {
      if (props.msg.message.status == 200 || props.msg.message.status == 201) {
        toast.info(`${props.msg.message.data.msg}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }, [props.msg]);

  return (
    <section className="tab-section">
      <Container>
        <Tabs
          className="tab"
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="home" title="Your Posts">
            <UserPosts />
          </Tab>

          <Tab eventKey="profile" title="Profile">
            <UserInfo />
          </Tab>
          <Tab eventKey="answer" title="Inbox">
            <AnswerComment />
          </Tab>
        </Tabs>
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
};

// export default Profile;
Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  msg: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  msg: state.msg,
});

export default connect(mapStateToProps)(Profile);
