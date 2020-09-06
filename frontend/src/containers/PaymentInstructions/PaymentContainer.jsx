import React, { Component } from "react";
import "../OrderDetails/OrderDetails.scss";
import StepsBtn from "../OrderDetails/StepsBtn";
import { connect } from "react-redux";
import LeftSideBlock from "../../components/LeftSide/LeftSideBlock";
import Footer from "../../components/Footer/Footer";
import PaymentInput from "./PaymentInput";

class PaymentInstruction extends Component {
  constructor(props) {
    super(props);
    this.state = { deviceType: "" };
  }

  render() {
    return (
      // <Fade bottom>
      <div className="mainOrderBlock">
        <div className="rightBlock verifyBlockRight">
          <div className="mainWrap">
            <StepsBtn></StepsBtn>
            <PaymentInput></PaymentInput>
          </div>
          <Footer />
        </div>
        <LeftSideBlock deviceType={this.state.deviceType}></LeftSideBlock>
      </div>
      // </Fade>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInstruction);
