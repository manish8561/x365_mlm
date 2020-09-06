import React, { Component } from "react";
import "./Home.scss";
import { connect } from "react-redux";
import LeftSideBlock from "../../components/LeftSide/LeftSideBlock";
import Header from "../../components/Header/Header";
import Homepage from "./Homepage";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { deviceType: "" };
  }

  render() {
    let { isLeftbar } = this.props;
    return (
      // <Fade bottom>
      <div className="mainBlock">
        <LeftSideBlock isLeftbar={isLeftbar} />
        <div className={`rightSection ${isLeftbar ? "isShow" : "isHide"}`}>
          <Header isLeftbar={isLeftbar} />
          <Homepage></Homepage>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
