import { actionTypes } from "../_actions/persist.action";

const initialState = {
  userDetails: {},
  done: false,
  address: '',
  loggedIn: false,
  loginType: 'metamask',//metamask,trustwallet,other
  isLeftbar: false,
  euroPrice: 1,
  totals: {},
  registerationPerDay: 0,
  totalParticipants: 1,
  reinvestLog: [],
  userIncomeLog: []
};
// GET_KYC_DATA_SUMSUB
const persist = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_USER_DETAIL:
      return {
        ...state,
        userDetails: action.data
      };
    case actionTypes.SAVE_STEP_RUNNING:
      return {
        ...state,
        step: action.data
      };
    case actionTypes.SAVE_ORDER_DETAIL:
      return {
        ...state,
        orderDetails: action.data
      };
    case actionTypes.DONE_ALL_STEPS:
      return {
        ...state,
        done: true
      };
    case actionTypes.RESET_DONE:
      return {
        ...state,
        done: false
      };
    case actionTypes.SAVE_LOGIN:
      return {
        ...state,
        address: action.data.address,
        loginType: action.data.loginType,
        loggedIn: true,
        isLeftbar: false
      };
    case actionTypes.LOGOUT:
      return {
        userDetails: {},
        done: false,
        address: '',
        loggedIn: false,
        isLeftbar: false
      };
    case actionTypes.IS_LEFTBAR_CHANGE:
      return {
        ...state,
        isLeftbar: action.data
      };
    case actionTypes.SAVE_REFERRAL_COUNT:
      return {
        ...state,
        userReferralCount: action.data.userReferralCount
      };
    case actionTypes.SAVE_EURO_PRICE:
      return {
        ...state,
        euroPrice: action.data
      };
    case actionTypes.SAVE_REGISTRATION_PER_DAY:
      return {
        ...state,
        registerationPerDay: action.data
      };
    case actionTypes.SAVE_TOTALS:
      return {
        ...state,
        totals: action.data
      };
    case actionTypes.SAVE_TOTAL_PARTICIPANTS:
      return {
        ...state,
        totalParticipants: action.data
      };
    case actionTypes.SAVE_REINVEST_LOG:
      return {
        ...state,
        reinvestLog: action.data
      };
    case actionTypes.SAVE_USER_INCOME_LOG:
      return {
        ...state,
        userIncomeLog: action.data
      };

    default:
      return state;
  }
};

export default persist;
