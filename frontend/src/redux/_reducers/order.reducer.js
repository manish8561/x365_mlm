import { actionTypes } from "../_actions/order.action";

const initialState = {
  adminBank: {},
  user_ref_id: "",
  formDataCopy: {}
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_STEP_FIRST:
      return {
        ...state
      };

    case actionTypes.SAVE_ADMIN_BANK:
      return {
        ...state,
        adminBank: action.data,
        user_ref_id: action.user_ref_id
      };
    case actionTypes.SAVE_FORM_DATA_COPY:
      let data = Object.assign({}, action.data);
      return {
        ...state,
        formDataCopy: data
      };
    default:
      return state;
  }
};

export default order;
