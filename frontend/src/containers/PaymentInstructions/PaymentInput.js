import React, { Component } from "react";
import { Form, Grid, Input, Button } from "semantic-ui-react";
import { deleteCookie, getCookie } from "../../_utils/index";
import "./PaymentInstructions.scss";
import {
  saveUserDetail,
  saveUserSteps,
  saveOrderDetails,
  done,
  saveRegDetail,
  saveFormData
} from "../../redux/_actions/persist.action";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  getAdminBanks,
  saveFormDataCopy,
  sendPaymentInstruction,
  getKycDetails
} from "../../redux/_actions/order.action";
import { CopyToClipboard } from "react-copy-to-clipboard";
import cogoToast from "cogo-toast";
import { withTranslation, Trans } from "react-i18next";

class PaymentInput extends Component {
  componentDidMount = () => {
    this.props.saveFormData({
      ...this.props.orderFormData,
      ...{ kyc_status: 1 }
    });
    let { merchant } = this.props;
    setTimeout(() => {
      if (merchant.merchant_id) {
        this.props.getAdminBanks({
          email: this.props.orderFormData.email,
          merchant_id: this.props.merchant.merchant_id,
          order_id: this.props.orderDetails.order_id
        });
        var data = {
          email: this.props.orderFormData.email,
          order_id: this.props.orderDetails.order_id
        };
        if (data.order_id) {
          this.props.sendPaymentInstruction(data);
        }
      }
    }, 2000);

    if (!getCookie("uniqueId") || getCookie("uniqueId") === "undefined") {
      let {
        match: { params },
        history
      } = this.props;
      history.push("/" + params.merchant);
    }
    this.getKycData();
  };

  getKycData = () => {
    // paiid/admin/getKycDataSumSub
    if (this.props.userDetails.kyc_application_id) {
      this.props.getKycDetails(this.props.userDetails.kyc_application_id);
    }
  };


  goToStep = () => {
    let { saveUserSteps, history, merchant } = this.props;
    // saveUserSteps(4);
    history.push("/" + merchant.url + "/payment/complete");
  };
  copyFormData = async () => {
    var data = Object.assign({}, this.props.orderFormData);
    await this.props.saveFormDataCopy(data);
    this.goToStepFirst();
  };

  goToStepFirst = () => {
    let {
      saveOrderDetails,
      saveUserDetail,
      saveUserSteps,
      saveRegDetail,
      saveFormData,
      merchant,
      history
    } = this.props;
    deleteCookie("uniqueId", "", 1);
    saveOrderDetails({});
    saveUserDetail({});
    saveUserSteps(1);
    saveRegDetail({});
    saveFormData({});
    history.push("/" + merchant.url);
  };
  copytoClipboard = () => {
    cogoToast.success("Copied", {
      position: "top-right"
    });
  };

  render() {
    let { payment, user_ref_id, merchant, t } = this.props;

    if (payment) {
    }

    return (
      <Form className="verificationForm verificationFormWrap PaymentBlocks">
        <h3>{t("Payment Instructions")}</h3>
        <Grid className="mg-l-r-0">
          <Grid.Row>
            <div className="importantBlock">
              {/* <h5>Important</h5> */}
              <p>
                {/* using Trans component for html tags */}
                <Trans i18nKey="reference_number_text">
                  <b>Reference Number:</b> When transferring funds, please ensure
                you include your unique Reference Number EXACTLY as it appears
                below (no spaces or additional text) in the Reference or Message
                field. This is how we track deposits and incorrect or missing
                details can result in delays or return of funds.
            </Trans>
              </p>
              <p>
                <Trans i18nKey="account_name_text">
                  <b>Account Name:</b> Please only transfer funds from a bank
                account in your name that matches your identification. Funds
                received from unknown accounts will be returned.
            </Trans>
              </p>
            </div>
          </Grid.Row>
        </Grid>
        <Grid className="OrderDetailsWrap">
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">{t("Bank Name")}</label>
              <br />
              <Input type="text" value={payment.bank_name} readonly />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">{t("Currency")}</label>
              <br />
              <Input type="text" value={payment.currency} readonly />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">{t("Account Name")}</label>
              <br />
              <Input type="text" value={payment.account_name} readonly />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">{t("swift_code_label")}</label>
              <br />
              <Input type="text" value={payment.swift_code} readonly />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">{t("account_number_label")}</label>
              <br />
              <Input type="text" value={payment.iban} readonly />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">{t("Reference Number")}</label>
              <br />
              <div className="reference-fld">
                <Input type="text" value={user_ref_id} readonly />
                <CopyToClipboard text={user_ref_id}>
                  <Button
                    color="primary"
                    size="medium"
                    id="myInput"
                    onClick={this.copytoClipboard}
                  >
                    {t("COPY")}
                  </Button>
                </CopyToClipboard>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16}>
              <label className="topLabel">{t("Account Holder Address")}</label>
              <br />
              <Input
                type="text"
                value={payment.account_holder_address}
                readonly
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16}>
              <label className="topLabel">{t("Bank Address")}</label>
              <br />
              <Input type="text" value={payment.bank_address} readonly />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid className="mg-l-r-0">
          <Grid.Row className="action-wrap">
            <a style={{ cursor: "pointer" }} onClick={this.copyFormData} >
              {merchant.merchant_currency === "FIAT" ? t("Return to Deposit Details") : "Return to Order Details"}
            </a>
            <Button type="button" className="submit" onClick={this.goToStep}>
              {t("PAYMENT COMPLETED")}
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
    orderDetails: state.persist.orderDetails,
    merchant: state.merchant.merchantDetails,
    userDetails: state.persist.userDetails
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
    saveFormDataCopy: data => dispatch(saveFormDataCopy(data)),
    sendPaymentInstruction: data => dispatch(sendPaymentInstruction(data)),
    getKycDetails: data => dispatch(getKycDetails(data))
    //
  };
};
export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PaymentInput)
));
