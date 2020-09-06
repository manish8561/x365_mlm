import React, { Component } from "react";
import { Form, Grid, Input } from "semantic-ui-react";
import { Field } from "redux-form";
import "./PaymentInstructions.scss";
import { deleteCookie } from "../../_utils/index";
import {
  saveUserDetail,
  saveUserSteps,
  saveOrderDetails,
  done
} from "../../redux/_actions/persist.action";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getAdminBanks } from "../../redux/_actions/order.action";
class PaymentInstructions extends Component {
  componentDidMount = () => {
    this.props.getAdminBanks();
    // setTimeout(() => {
    //   this.props.done();
    // }, 3000);
  };

  componentDidUnmount = () => {
    this.goToStepFirst();
  };
  // saveUserDetail
  goToStepFirst = () => {
    let { saveOrderDetails, saveUserDetail, saveUserSteps } = this.props;
    deleteCookie("uniqueId", "", 1);
    saveOrderDetails({});
    saveUserDetail({});
    saveUserSteps(1);
  };

  render() {
    let payment = this.props.payment;
    return (
      <Form className="verificationForm verificationFormWrap PaymentBlocks">
        <h3 className="mb20">PAYMENT INSTRUCTIONS</h3>
        <p className="mb40">
          Please deposit funds using the Bank Account details and Reference
          Number provided below.
        </p>
        <Grid className="OrderDetailsWrap">
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Account Number</label>
              <br />
              <p> {payment.iban} </p>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Currency</label>
              <br />
              <p>{payment.currency}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Bank Name</label>
              <br />
              <p>{payment.bank_name}</p>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">BIC / SWIFT Code</label>
              <br />
              <p>{payment.swift_code}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Account Number / IBAN</label>
              <br />
              <p>{payment.iban}</p>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Reference Number</label>
              <br />
              <p>{payment.reference_number}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Account Holder Address</label>
              <br />
              <p>{payment.account_holder_address}</p>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <label className="topLabel">Bank Address</label>
              <br />
              <p>{payment.bank_address}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
      </Form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    payment: state.order.adminBank,
    //   orderDetails: state.persist.orderDetails
    userDetails: state.persist.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveUserDetail: data => dispatch(saveUserDetail(data)),
    saveUserSteps: data => dispatch(saveUserSteps(data)),
    saveOrderDetails: data => dispatch(saveOrderDetails(data)),
    getAdminBanks: data => dispatch(getAdminBanks(data)),
    done: data => dispatch(done(data))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PaymentInstructions)
);
