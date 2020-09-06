import { startLoading, stopLoading } from "./loading.action";
import { toast } from "../../components/Toast/Toast";
import { UserService } from "../../Services/UserService";
import {
  saveUserDetail,
} from "./persist.action";
// import { setCookie } from "../../_utils/index";

/** seting action types */
export const actionTypes = {
  SAVE_STEP_FIRST: "SAVE_STEP_FIRST",
  SAVE_ADMIN_BANK: "SAVE_ADMIN_BANK",
  GET_MERCHANT_DETAILS: "GET_MERCHANT_DETAILS"
};


/*
 * Action creators for login
 */
export function saveStepFirstCompeted(data) {
  return {
    type: actionTypes.SAVE_STEP_FIRST,
    data
  };
}

export function saveAdminBank(data, user_ref_id) {
  return {
    type: actionTypes.SAVE_ADMIN_BANK,
    data,
    user_ref_id: user_ref_id
  };
}

export function getDetailsMerchant(data) {
  return {
    type: actionTypes.GET_MERCHANT_DETAILS,
    data
  };
}

export function saveFirstStep(data, history) {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(startLoading());
    return UserService.saveStepFirst(data)
      .then(async res => {
        dispatch(stopLoading());
        dispatch(
          saveUserDetail({
            email: data.email,
            order_id: res.data.data.order_id,
            unique_client_id: res.data.data.unique_client_id
          })
        );
        // dispatch(saveUserSteps(2));
        history.push(
          "/" + state.merchant.merchantDetails.url + "/email/verification"
        );
      })
      .catch(error => {
        if (error) {
          toast.error(error["data"]["message"]);
        }
        dispatch(stopLoading());
      });
  };
}

export function resendEmail(data) {
  return dispatch => {
    dispatch(startLoading());
    return UserService.resendEmailVerification(data)
      .then(data => {
        dispatch(stopLoading());
        toast.success(
          "Email verification link has been sent, Please check your email"
        );
      })
      .catch(error => {
        if (error) {
          toast.error(error["data"]["message"]);
        }
        dispatch(stopLoading());
      });
  };
}
