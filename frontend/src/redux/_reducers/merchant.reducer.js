import { actionTypes } from "../_actions/order.action";

const initialState = {
  merchantDetails: {}
};

const merchant = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_MERCHANT_DETAILS:
      return {
        ...state,
        merchantDetails: action.data
      };
    default:
      return state;
  }
};

export default merchant;
