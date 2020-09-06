import React, { Component } from "react";
import "./Transaction.scss";
import { connect } from "react-redux";
import LeftSideBlock from "../../components/LeftSide/LeftSideBlock";
import Header from "../../components/Header/Header";
import Transactionpage from "./Transactionpage";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = { deviceType: "" };
  }

  render() {
    let { isLeftbar } = this.props;
    return (
      <div className="mainBlock">
        <LeftSideBlock isLeftbar={isLeftbar} />
        <div className={`rightSection ${isLeftbar ? "isShow" : "isHide"}`}>
          <Header isLeftbar={isLeftbar} />
          <Transactionpage></Transactionpage>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLeftbar: state.persist.isLeftbar
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
