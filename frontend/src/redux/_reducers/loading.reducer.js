import { actionTypes } from "../_actions/loading.action";

const initialState = {
  meta: { loading: false }
};

const loading = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        meta: {
          loading: true
        }
      };
    case actionTypes.STOP_LOADING:
      return {
        meta: {
          loading: false
        }
      };

    default:
      return state;
  }
};

export default loading;
