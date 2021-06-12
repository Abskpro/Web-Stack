import { DISPLAY_MSG, GET_ERRORS , RESET} from "../actions/types";
const isEmpty = require("is-empty");

const initialState = {
  message: {},
  error: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DISPLAY_MSG:
      return {
        ...state,
        message: action.payload,
      };
    case RESET:
      return initialState;

    case GET_ERRORS:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
