import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  DISPLAY_MSG,
} from "./types";

import { DISPLAY_DETAILS, STORE_POSTS } from "./types";
import axios from "axios";

export const displayDetails = (data) => (dispatch) => {
  console.log("details is being dispatched");
  dispatch({
    type: DISPLAY_DETAILS,
    payload: data,
  });
};

//simple message tranfer to routed screen
//todo add the api and route the message and data
export const routeAndDisplay = (msg) => (dispatch) => {
  console.log(msg);
  dispatch(setMessage(msg));
};

export const setMessage = (res) => {
  console.log(res);
  return {
    type: DISPLAY_MSG,
    payload: res,
  };
};

export const storePost = (url, id, postData, history) => (dispatch) => {
  console.log(url, id, postData, history);
  setTimeout(function () {
    console.log(url, id, postData, history);
  }, 1000);
  axios
    .post(`${url}/${id}`, postData)
    .then((res) => {
      console.log(res);
      if (res.status == 201) {
        dispatch(setMessage(res.data.msg));
        // routeAndDisplay(res.data.msg);
        history.push({
          pathname: "/profile",
        });
      } else if (res.status == 400) {
        dispatch(setMessage(res.data.msg));
      }
    })
    .catch((error) => {
      console.log(error.response);
    });
};
