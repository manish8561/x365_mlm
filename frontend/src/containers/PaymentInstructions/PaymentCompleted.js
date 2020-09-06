import React, { Component } from "react";
import { Form, Grid, Input, Button } from "semantic-ui-react";
import { deleteCookie } from "../../_utils/index";
import {
  saveUserDetail,
  saveUserSteps,
  saveOrderDetails,
  done,
  saveFormData,
  saveRegDetail
} from "../../redux/_actions/persist.action";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import { getAdminBanks, setUserLanguageAfterOrder } from "../../redux/_actions/order.action";
export class PaymentCompleted extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUnmount = () => {
    this.goToStepFirst();
    this.props.done();
  };

  goToStepFirst = () => {
    let {
      saveOrderDetails,
      saveUserDetail,
      saveUserSteps,
      saveRegDetail,
      saveFormData,
      setUserLanguageAfterOrder,
      merchant,
      history
    } = this.props;
    deleteCookie("uniqueId", "", 2);
    saveOrderDetails({});
    saveUserDetail({});
    saveUserSteps(1);
    saveFormData({});
    saveRegDetail({});
    localStorage.clear();
    setUserLanguageAfterOrder();
    history.push("/" + merchant.url);
    window.location.reload();
  };
  render() {
    const { orderFormData, t } = this.props;
    const { email } = orderFormData;
    return (
      <Form className="verificationForm verificationFormWrap PaymentBlocks">
        <h3 className="mb20">{t("Payment Completed")}</h3>
        <Grid className="mg-l-r-0">
          <Grid.Row>
            <div className="importantBlock">
              <h5>{t("Thank You & Next Steps")}</h5>
              <p>
                <Trans i18nKey="payment_complete_1">
                  Once your payment has been received and processed you will be
                  sent a confirmation email to:
                <b>{{ email }}</b>
                </Trans>
              </p>
              <p>
                <Trans i18nKey="payment_complete_2">
                  Please allow up to 3 business days for your payment to be
                  received and processed. If you have not received confirmation
                  after 3 business days please email:
                </Trans>
                &nbsp;
                <b>
                  <a href="mailto:info@paiid.io">info@paiid.io</a>
                </b>
              </p>
              <p>
                <b>{t("payment_complete_thankyou")}</b>
              </p>
            </div>
          </Grid.Row>
        </Grid>
        <Grid className="mg-l-r-0">
          <Grid.Row>
            <Button
              type="button"
              className="submit"
              onClick={this.goToStepFirst}
            >{t("RETURN TO HOME")}
            </Button>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    payment: state.order.adminBank,
    user_ref_id: state.order.user_ref_id,
    orderFormData: state.persist.orderFormData,
    merchant: state.merchant.merchantDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveUserDetail: data => dispatch(saveUserDetail(data)),
    saveUserSteps: data => dispatch(saveUserSteps(data)),
    saveOrderDetails: data => dispatch(saveOrderDetails(data)),
    getAdminBanks: data => dispatch(getAdminBanks(data)),
    done: data => dispatch(done(data)),
    saveRegDetail: data => dispatch(saveRegDetail(data)),
    saveFormData: data => dispatch(saveFormData(data)),
    setUserLanguageAfterOrder: () => dispatch(setUserLanguageAfterOrder()),
  };
};

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PaymentCompleted)
));
